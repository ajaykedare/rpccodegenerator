function MainService (httpService,rootScope,q)
{
	this.httpService = httpService;
	this.rootScope=rootScope;
	this.q=q;	
	console.log('Service Initialised !');
}

MainService.prototype.init = function(){	

};