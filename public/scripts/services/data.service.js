(function() {
    'use strict';

    app.factory('DataService', dataService);

    dataService.$inject = ['$http', 'UrlToServerService'];

    function dataService($http, UrlToServerService) {
        var users = [];

        var service = {
            loadUserData: function (){
                $http.get(UrlToServerService.getUrlFromServer()+"/alluser").
                success(function(result, status, headers, config) {
                    if(result.data){
                        users = result.data;
                    }

                }).
                error(function(result, status, headers, config) {

                });
            }
            ,
            getAllUser: function () {
                return users;
            }
        };
        return service;
    };
})();