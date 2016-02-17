(function() {
    'use strict';

    app.factory('LoginService', loginServices);

    loginServices.$inject = ['$http', 'UrlToServerService', 'DataService', 'WebSocketService'];

    function loginServices($http, UrlToServerService, DataService, WebSocketService) {
        var service = {
            login: function (username, password, success, error){
                var request = $http({
                    method: "post",
                    url: UrlToServerService.UrlFromServer+"/login",
                    data: {username: username, password: password},
                    headers: {'Content-Type': 'application/json; charset=UTF-8'}
                });

                request.success(function (data) {
                    if(data && data.token){
                        localStorage.setItem("token", data.token);
                        DataService.loadUserData();
                        WebSocketService.connect();
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
                    url: UrlToServerService.UrlFromServer+"/logout",
                    data: {token: localStorage.getItem("token")},
                    headers: {'Content-Type': 'application/json; charset=UTF-8'}
                });

                request.success(function (data) {
                    localStorage.removeItem("token");
                    DataService.loadUserData();
                    WebSocketService.disconnect();
                    if(success){
                        success();
                    }
                });
                request.error(function (data, status, headers, config) {
                    localStorage.removeItem("token");
                    DataService.loadUserData();
                    WebSocketService.disconnect();
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