(function() {
    'use strict';

    app.factory('DataService', dataService);

    dataService.$inject = ['$http', 'UrlToServerService'];

    function dataService($http, UrlToServerService) {
        var user = [];

        var service = {
            loadUserData: function (callback){
                $http.get(UrlToServerService.getUrlFromServer()+"/alluser").
                    success(function(result, status, headers, config) {
                        if(result.data){
                            callback(result.data);
                        }else {
                            callback([]);
                        }

                }).
                    error(function(result, status, headers, config) {
                        callback([]);
                });
            }
        };
        return service;
    };
})();