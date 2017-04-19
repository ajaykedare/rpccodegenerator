package rpccodegenerator.dao;

import java.util.ArrayList;
import java.util.List;

import org.springframework.orm.hibernate3.HibernateTemplate;

import rpccodegenerator.beans.User;  
public class UserDao {  
	HibernateTemplate template;  
	public void setTemplate(HibernateTemplate template) {  
		this.template = template;  
	}  
	//method to save User  
	public void saveUser(User u){  
		template.save(u);  
	}  
	//method to update User  
	public void updateUser(User u){  
		template.update(u);  
	}  
	//method to delete User  
	public void deleteUser(User u){  
		template.delete(u);  
	}  
	//method to return one User of given id  
	public User getById(int id){  
		User r=(User)template.get(User.class,id);  
		return r;  
	}  
	//method to return all Users  
	public List<User> getUsers(){  
		List<User> list=new ArrayList<User>();  
		list=template.loadAll(User.class);  
		return list;  
	}
	
	//method to return all Users for given user
	@SuppressWarnings("unchecked")
	public User getUserByUsername(String username){
		
		User u = (User)template.getSessionFactory().openSession().createQuery(
			    "from User r where r.username = :username")
			    .setParameter("username", username)
			    .uniqueResult();
				  
		return u;  
	}
		
}