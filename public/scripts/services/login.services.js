(function() {
    'use strict';

    app.factory('LoginService', loginServices);

    loginServices.$inject = ['$http', 'UrlToServerService', 'DataService'];

    function loginServices($http, UrlToServerService, DataService) {
        var service = {
            login: function (username, password, success, error){
                var request = $http({
                    method: "post",
                    url: UrlToServerService.getUrlFromServer()+"/login",
                    data: {username: username, password: password},
                    headers: {'Content-Type': 'application/json; charset=UTF-8'}
                });

                request.success(function (data) {
                    if(data && data.token){
                        localStorage.setItem("token", data.token);
                        DataService.loadUserData();
                    }

                    if(success){
                        success();
                    }
                });
                request.error(function (data, status, headers, config) {
                    if(error){
                        error();
                    }
                });
            }
            ,
            logout: function (success, error) {
                var request = $http({
                    method: "post",
                    url: UrlToServerService.getUrlFromServer()+"/logout",
                    data: {token: localStorage.getItem("token")},
                    headers: {'Content-Type': 'application/json; charset=UTF-8'}
                });

                request.success(function (data) {
                    localStorage.removeItem("token");
                    DataService.loadUserData();
                    if(success){
                        success();
                    }
                });
                request.error(function (data, status, headers, config) {
                    localStorage.removeItem("token");
                    DataService.loadUserData();
                    if(error){
                        error();
                    }
                });
            }
            ,
            isLogin: function () {
                return localStorage.getItem("token") !== null && localStorage.getItem("token") !== undefined;
            }

        };
        return service;
    };
})();