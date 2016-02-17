(function() {
    'use strict';

    app.config(configure);
    	
    configure.$inject = ['$routeProvider'];
    
    function configure($routeProvider) {

		$routeProvider
	    	.when('/chat', chat())
			.otherwise({redirectTo: '/'});
    	 
    	function chat(){
			return {
				templateUrl: './public/scripts/controller/chat/chat-tpl.html',
				controller: 'ChatController'
			}
		};
	};
})();