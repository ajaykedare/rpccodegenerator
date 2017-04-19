package rpccodegenerator.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;

import rpccodegenerator.services.MainService;

@Controller
@Component
public class MainController {

	@Autowired
	MainService mainService;	
	
	
}
