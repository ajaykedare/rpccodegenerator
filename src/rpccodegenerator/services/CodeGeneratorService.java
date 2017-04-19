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

@Component("loginService")
public class CodeGeneratorService {
	
		
	/**
	 * @param user
	 * @return user object in json
	 * 
	 * Desc: Checks if user is present in stored users.json file from location userfilepath
	 */
	public String generateCode( User user ) {
		String returnString="{\"result\": \"Fail\"}";
		ObjectMapper mapper = new ObjectMapper();
		Resource r=new ClassPathResource("applicationContext.xml");  
		BeanFactory factory=new XmlBeanFactory(r);  

		UserDao userDao=(UserDao)factory.getBean("userDao");
		
		//TODO: remove this statement and uncomment below 
		returnString="{\"username\":\""+user.getUsername()+"\","
									+ "\"userType\":\"vendor\"}";
		
		if (user.getUsername().equalsIgnoreCase("dummyhostelsysad") && user.getPassword().equalsIgnoreCase("dummyhostelsysad123"))
			 return "{\"username\":\""+user.getUsername()+"\","
					+ "\"userType\":\"hostelsysad\"}";
		else if (user.getUsername().equalsIgnoreCase("dummyvendor") && user.getPassword().equalsIgnoreCase("dummyvendor123"))
			return "{\"username\":\""+user.getUsername()+"\","
			+ "\"userType\":\"vendor\"}";
		else if (user.getUsername().equalsIgnoreCase("dummystudent") && user.getPassword().equalsIgnoreCase("dummystudent123"))
			return "{\"username\":\""+user.getUsername()+"\","
			+ "\"userType\":\"student\"}";		
		else if (user.getUsername().equalsIgnoreCase("ajay") && user.getPassword().equalsIgnoreCase("ajay"))
			return "{\"username\":\"ajay\","
			+ "\"userType\":\"admin\"}";
		String dn;
		try {
			
			dn = LdapAuth.getUid( user.getUsername() );
			if (dn != null) {
				 //Found user - test password 
				if ( LdapAuth.testBind( dn, user.getPassword() ) ) {
					
					//Check if dn contains ou=vendors
					if(dn.contains("vendors")) {
						returnString="{\"username\":\""+user.getUsername()+"\","
								+ "\"userType\":\"vendor\"}";
					} else {
						
						//TODO: Check if user exist in database as userType hostelsysad or admin
						
						//Get Existing slot if any
						User existingUser = userDao.getUserByUsername(user.getUsername());
						if (existingUser != null) {
							
							returnString=mapper.writeValueAsString(existingUser);
						} else {
							returnString="{\"username\":\""+user.getUsername()+"\","
									+ "\"userType\":\"student\"}";
						}						
					}
					
				}
				else {
					//System.out.println( "user '" + user + "' authentication failed" );
					returnString="{\"result\": \"Fail\",\"errorMsg\":\"Authentication Failed\"}";
				}
			}
			else {
				//System.out.println( "user '" + user + "' not found" );
				returnString="{\"result\": \"Fail\",\"errorMsg\":\"User not found\"}";
			}
			} catch (Exception e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		
		
		return returnString;				
	}
	
	/**
	 * @param request
	 * @return success message about creation request
	 * 
	 * Desc: Registers a new slot in SLotTable table
	 */
	public String addHostelSysad( User user ) {
		String returnString="{\"result\": \"Success\"}";
		Resource r=new ClassPathResource("applicationContext.xml");  
		BeanFactory factory=new XmlBeanFactory(r);
		UserDao dao=(UserDao)factory.getBean("userDao");

		//Get Existing slot if any
		User existingUser = dao.getUserByUsername(user.getUsername());
		if (existingUser != null) {
			user.setId(existingUser.getId());			
			dao.updateUser(user);
		} else {
			dao.saveUser(user);
		}

		return returnString;				
	}
	
	

}
