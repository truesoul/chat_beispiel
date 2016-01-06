(function() {
    'use strict';

    app.config(configure);
    	
    configure.$inject = ['$routeProvider'];
    
    function configure($routeProvider) {

		$routeProvider
	    	.when('/chat', chat())
			.when('/login', login())
			.otherwise({redirectTo: '/'});
    	 
    	function chat(){
			return {
				templateUrl: './public/templates/chat-tpl.html',
				controller: 'ChatController'
			}
		};

		function login(){
			return {
				templateUrl: './public/templates/login-tpl.html',
				controller: 'LoginController'
			}
		};
	};
})();