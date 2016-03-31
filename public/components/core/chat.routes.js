(function() {
    'use strict';

    app.config(configure);
    	
    configure.$inject = ['$routeProvider', '$httpProvider'];
    
    function configure($routeProvider, $httpProvider) {

		$routeProvider
	    	.when('/chat', chat($httpProvider))
			.when('/login', login())
			.otherwise({redirectTo: '/'});
    	 
    	function chat($httpProvider){
			return {
				templateUrl: './public/components/controller/chat/chat-tpl.html',
				controller: 'ChatController',
				resolve: {
					authorize:function($http, UrlToServerService) {
						return $http.get(UrlToServerService.UrlFromServer+"/isauth");
					}
				}
			}
		};

		function login(){
			return {
				templateUrl: './public/components/controller/login/login-tpl.html',
				controller: 'LoginController'
			}
		};

		$httpProvider.interceptors.push(['$q', '$location', function ($q, $location) {
			return {
				'request': function (config) {
					config.headers = config.headers || {};
					var token = localStorage.getItem("token");
					if(token){
						config.headers.Authorization = token;
					}

					return config;
				},
				'responseError': function (response) {
					if (response.status === 401 || response.status === 403) {
						$location.path("/login");
					}

					return $q.reject(response);
				},
				'response': function(response) {

					return response;
				}
			};
		}]);
	};
})();