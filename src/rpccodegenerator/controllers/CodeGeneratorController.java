package rpccodegenerator.controllers;
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

	/**
	 * @param user
	 * @return user object in json
	 * 
	 * Desc: Gets the method signature and generates the code at a location
	 */
	@RequestMapping(value="generateCode", method=RequestMethod.POST,headers="Accept=application/json")
	public @ResponseBody String generateCode( @RequestBody User user ) {
		return codeGeneratorService.generateCode(user);		
	}
	
	/**
	 * @param user
	 * @return user object in json
	 * 
	 * Desc: Adds the user against the LDAP authentication
	 */
	@RequestMapping(value="addHostelSysad", method=RequestMethod.POST,headers="Accept=application/json")
	public @ResponseBody String addHostelSysad( @RequestBody User user ) {
		return codeGeneratorService.addHostelSysad(user);		
	}

	
}