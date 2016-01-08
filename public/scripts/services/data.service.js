(function() {
    'use strict';

    app.factory('DataService', dataService);

    dataService.$inject = ['$http', 'UrlToServerService'];

    function dataService($http, UrlToServerService) {
        var user = [];

        var service = {
            loadUserData: function (){
                $http.get(UrlToServerService.getUrlFromServer()+"/alluser").
                    success(function(result, status, headers, config) {
                        user = result.data;
                }).
                    error(function(result, status, headers, config) {

                });
            }
            ,
            getAllUser: function () {
                return user;
            }
        };
        return service;
    };
})();