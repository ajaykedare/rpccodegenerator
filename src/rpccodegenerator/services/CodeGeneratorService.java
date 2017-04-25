package rpccodegenerator.services;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonReader;
import org.kamranzafar.jtar.TarEntry;
import org.kamranzafar.jtar.TarOutputStream;
import org.springframework.stereotype.Component;


class StructMember {
	public String type;
	public String name;
	
	public StructMember(JsonObject obj) {
		type = obj.getString("type");
		name = obj.getString("name");
	}
	public String toString() {
		return type + " " + name + ";";
	}
}

class StructDef {
	public String name;
	public List<StructMember> members = new ArrayList<StructMember>();
	
	public StructDef(JsonObject obj) {
		//structure += obj.getString("type");
		name = obj.getString("name");
		
		JsonArray memberArray = obj.getJsonArray("members");
		if(memberArray != null) {
			for (int j=0 ; j<memberArray.size() ; ++j) {
				StructMember member = new StructMember(memberArray.getJsonObject(j));
				members.add(member);
			}
		}
	}

	public String toString() {
		String structure = "";
		
		structure += "struct " + name + " {\n";
		
		for (int j=0 ; j<members.size() ; ++j) {
			structure += "\t" + members.get(j).toString() + "\n";
		}
		
		structure += "};";
		
		return structure;
	}
}

class FunctionDef {
	public String type = "";
	public String name = "";
	public String parameterType = "void";
	public String parameterName = "arg";
	
	public String toString() {
		return type + " " + name + " (" + parameterType + " " + parameterName + ")";
	}
	public String toStringServer(String version) {
		return type + " *" + name + "_" + version + "_svc" + " (" + parameterType + " *" + parameterName + ", struct svc_req *req)";
	}
	public FunctionDef(JsonObject obj) {
		type = obj.getString("returntype");
		name = obj.getString("methodname");

		JsonArray paramArray = obj.getJsonArray("parameters");
		if(paramArray != null && paramArray.size()>0) {
			parameterType = paramArray.getJsonObject(0).getString("type");
			parameterName = paramArray.getJsonObject(0).getString("name");
		}
	}
}

class ProgramDef {
	public String programName = "";
	public String version = "1";
	public List<FunctionDef> functions = new ArrayList<FunctionDef>();
	public String uniqueID = "0x2fffffff";
	
	public ProgramDef(JsonObject obj) {
		version 	= obj.getString("version");
		programName = obj.getString("program_name");


		JsonArray methodsArray = obj.getJsonArray("methods");
		for (int i = 0; i < methodsArray.size(); ++i) {
			FunctionDef function = new FunctionDef(methodsArray.getJsonObject(i));
			functions.add(function);
		}
	}
	
	public String toString() {
		String program = "";
		
		program += "program " + programName + "{\n";
		program += "\tversion " + programName + "_v" + version + " {\n";
		
		for (int i = 0; i < functions.size(); ++i) {
			program += "\t\t" + functions.get(i).toString() + " = " + (i+1) + ";\n";
		}

		program += "\t} = " + version + ";\n";
		program += "} = 0x2fffffff;\n";
		
		return program;
	}
}

class rpc_generator {
	public ProgramDef program;
	public List<StructDef> structs = new ArrayList<StructDef>();
	
	public rpc_generator(JsonObject obj) {
		program = new ProgramDef(obj);

		JsonArray objarr = obj.getJsonArray("data_structures");
		for (int i = 0; i < objarr.size(); ++i) {
			StructDef struct = new StructDef(objarr.getJsonObject(i) );
			structs.add(struct);
		}
		
	}
	
	public void saveRpcXFile(String path) {
		try{
		    PrintWriter writer = new PrintWriter(path, "UTF-8");
		    for (int i=0 ; i<structs.size() ; ++i) {
		    	writer.println(structs.get(i).toString() + "\n");
		    }
		    writer.println(program.toString());
		    writer.close();
		} catch (IOException e) {
			System.err.println("Unable to write rpc *.x file at " + path + "\n" + e.getMessage());
		}
	}

	public void saveClientSkelFile(String path) {
		String clientFile = 
		"#include \"rpc.h\"\n" +
		"\n" +
		"int main(int argc, char *argv[])\n" +
		"{\n" +
		"    CLIENT *cl;\n";
		
		for (int i=0 ; i<program.functions.size() ; ++i) {
			clientFile += "    " + program.functions.get(i).type + " * result_" + program.functions.get(i).name + ";\n";

			clientFile += "    " + program.functions.get(i).parameterType;
			
			if(program.functions.get(i).parameterType.equals("void")) {
				clientFile += " *";
			}
			
			clientFile += " arg_" + program.functions.get(i).parameterName + ";\n\n";
		}
		
		clientFile += 
		"\n" +
		"    if (argc < 1)\n" +
		"        return 1;\n" +
		"\n" +
		"    cl = clnt_create(argv[1], " + program.programName + ", " + program.programName + "_v" + program.version + ", \"tcp\");\n" +
		"    if (cl == NULL) {\n" +
		"        printf(\"error: could not connect to server.\\n\");\n" +
		"        return 1;\n" +
		"    }\n" +
		"\n\n";
		
		for(int i=0 ; i<program.functions.size() ; ++i) {
			clientFile += 
			"    result_" + program.functions.get(i).name + " = " + program.functions.get(i).name + "_" + program.version + "(";
			if(program.functions.get(i).parameterName != "") 
				clientFile += "&arg_" + program.functions.get(i).parameterName + ", ";
			clientFile += "cl);\n" +
			"    if (result_" + program.functions.get(i).name + " == NULL) {\n" +
			"        printf(\"error: RPC failed!\\n\");\n" +
			"        return 1;\n" +
			"    }\n\n";
		}

		clientFile += 
		"\n" +
		"    return 0;\n" +
		"}\n";

		
		
		try{
		    PrintWriter writer = new PrintWriter(path, "UTF-8");
		    writer.println(clientFile);
		    writer.close();
		} catch (IOException e) {
			System.err.println("Unable to write client file at " + path + "\n" + e.getMessage());
		}
	}

	public void saveServerSkelFile(String path) {
		String serverFile = 
		"#include <stdlib.h>\n" +
		"#include \"rpc.h\"\n" +
		"\n";

		for (int i=0 ; i<program.functions.size() ; ++i) {
			if(program.functions.get(i).type.equals("void")) {
				serverFile += program.functions.get(i).type + " *result_" + program.functions.get(i).name + ";\n";
			} else {
				serverFile += program.functions.get(i).type + " result_" + program.functions.get(i).name + ";\n";
			}
		}
		
		serverFile += 
		"\n";
		

		for (int i=0 ; i<program.functions.size() ; ++i) {
			serverFile +=
			program.functions.get(i).toStringServer(program.version) + 
			" {\n\n\treturn &result_" + program.functions.get(i).name + ";\n}\n\n";
		}

		
		try{
		    PrintWriter writer = new PrintWriter(path, "UTF-8");
		    writer.println(serverFile);
		    writer.close();
		} catch (IOException e) {
			System.err.println("Unable to write client file at " + path + "\n" + e.getMessage());
		}
	}
	
	public void saveMakeFile(String path) {
		String makeFile = 
				".SUFFIXES:\n.SUFFIXES: .c .o\nCLNT = rpc\nSRVR = rpc_svc\nCFLAGS = -g -Wall\n\nSRVR_OBJ = server.o rpc_xdr.o rpc_svc.o\nCLNT_OBJ = client.o rpc_xdr.o rpc_clnt.o\n\n" +
					".c.o:; gcc -c -o $@ $(CFLAGS) $<\n\ndefault: $(CLNT) $(SRVR)\n\n$(CLNT): $(CLNT_OBJ) rpc.h\n\tgcc -o $(CLNT) $(CLNT_OBJ)\n\n" +

					"$(SRVR): $(SRVR_OBJ) rpc.h\n" +
					"\tgcc -o $(SRVR) $(SRVR_OBJ)\n\n" +

					"clean:\n" +
						"\trm *.o $(CLNT) $(SRVR)\n" +
						"\trm -i *~\n" +
						"\trm core\n";

		try{
		    PrintWriter writer = new PrintWriter(path, "UTF-8");
		    writer.println(makeFile);
		    writer.close();
		} catch (IOException e) {
			System.err.println("Unable to write client file at " + path + "\n" + e.getMessage());
		}
	}
}



@Component("codeGeneratorService")
public class CodeGeneratorService {	
		
	
	public String generateCode( String jsonData ) {
		String returnString="{\"result\": \"Success\"}";
		
		JsonReader reader = Json.createReader(new StringReader(jsonData));
		JsonObject programObject = reader.readObject();
		reader.close();
		
		rpc_generator generator = new rpc_generator(programObject);
		
		String directoryName = "/home/dexter/generated";
	    
	    File directory = new File(directoryName);
	    if (! directory.exists()){
	        directory.mkdirs();	        
	    }
	    
	    
		generator.saveRpcXFile(directoryName+"/rpc.x");
		generator.saveClientSkelFile(directoryName+"/client.c");
		generator.saveServerSkelFile(directoryName+"/server.c");
		generator.saveMakeFile(directoryName+"/Makefile");

		try {
			// Output file stream
			FileOutputStream dest = new FileOutputStream( directoryName+"/rpc.tar" );
	
			// Create a TarOutputStream
			TarOutputStream out = new TarOutputStream( new BufferedOutputStream( dest ) );
	
			// Files to tar
			File[] filesToTar=new File[4];
			filesToTar[0]=new File(directoryName+"/client.c");
			filesToTar[1]=new File(directoryName+"/server.c");
			filesToTar[2]=new File(directoryName+"/rpc.x");
			filesToTar[3]=new File(directoryName+"/Makefile");

			for(File f:filesToTar){
				out.putNextEntry(new TarEntry(f, f.getName()));
				BufferedInputStream origin = new BufferedInputStream(new FileInputStream( f ));
	
				int count;
				byte data[] = new byte[2048];
				while((count = origin.read(data)) != -1) {
					out.write(data, 0, count);
				}
		
			    out.flush();
			    origin.close();
			}
			out.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		

		return returnString;				
	}
	
	

}
