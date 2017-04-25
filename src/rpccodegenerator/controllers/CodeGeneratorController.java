package rpccodegenerator.controllers;
import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import rpccodegenerator.services.CodeGeneratorService;

@Controller
@Component
public class CodeGeneratorController {

	@Autowired
	CodeGeneratorService codeGeneratorService;	
	
	
	@RequestMapping(value="generateCode", method=RequestMethod.POST,headers="Accept=application/json")
	public @ResponseBody String generateCode( HttpServletRequest req, HttpServletResponse res ) {
		String jsonString = null;
		String returnString="{\"result\": \"Fail\"}";
		try {
			jsonString = req.getReader().readLine();
			System.out.println("Request object received : "+jsonString);
			// Code to Generate RPC Files
			String path = codeGeneratorService.generateCode(jsonString);
			return "{\"result\": \"Success\"}";
			
		}catch (IOException e) {
			e.printStackTrace();
		}
		return returnString;
	}

	
}