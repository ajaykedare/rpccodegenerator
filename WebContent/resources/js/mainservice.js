function MainService (httpService,rootScope,q)
{
	this.httpService = httpService;
	this.rootScope=rootScope;
	this.q=q;
	this.currentUser={};
	this.isUserLoggedIn=false;
	console.log('Service Initialised !');
}

MainService.prototype.init = function(){
	
	

};


MainService.prototype.showOpenRequests = function(){
	var urlToPost = "getRequests/"+this.currentUser.username;
	var deferred = this.q.defer();
	return this.httpService({
			method : 'POST',
			url : urlToPost,
	})
    .then(function (response) {
        // promise is fulfilled
        deferred.resolve(response.data);
        // promise is returned
        console.log('Requests retrieved !');	
        return deferred.promise;
    }, function (response) {
        // the following line rejects the promise 
        deferred.reject(response);
        console.log('Error in requests retrieved !');
        // promise is returned
        return deferred.promise;
    });	
};