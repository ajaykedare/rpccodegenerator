package rpccodegenerator.services;

import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.xml.XmlBeanFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import rpccodegenerator.authentication.LdapAuth;
import rpccodegenerator.beans.User;
import rpccodegenerator.dao.UserDao;

@Component("codeGeneratorService")
public class CodeGeneratorService {
	
		
		public String generateCode1( User user ) {
		String returnString="{\"result\": \"Success\"}";
		
		
		
		return returnString;				
	}
	
	
	public String generateCode( String jsonData ) {
		String returnString="{\"result\": \"Success\"}";
		
		//Write a Code to Generate the RPC Files
		

		return returnString;				
	}
	
	

}
