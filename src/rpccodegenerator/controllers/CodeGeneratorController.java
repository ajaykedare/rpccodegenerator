package rpccodegenerator.controllers;
import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import rpccodegenerator.beans.User;
import rpccodegenerator.services.CodeGeneratorService;

@Controller
@Component
public class CodeGeneratorController {

	@Autowired
	CodeGeneratorService codeGeneratorService;	

	@RequestMapping(value="generateCode", method=RequestMethod.POST,headers="Accept=application/json")
	public @ResponseBody String generateCode( @RequestBody User user ) {
		return codeGeneratorService.generateCode(user);		
	}
	
	@RequestMapping(value="saveModRequests", method=RequestMethod.POST,headers="Accept=application/json")
	public @ResponseBody String savepoems( HttpServletRequest req, HttpServletResponse res ) {
		String jsonString = null;
		try {
			jsonString = req.getReader().readLine();
			System.out.println("Request object received : "+jsonString);
		}catch (IOException e) {
			e.printStackTrace();
		}
		return "Success";
	}

	
}