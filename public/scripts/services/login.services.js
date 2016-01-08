(function() {
    'use strict';

    app.factory('LoginService', loginServices);

    loginServices.$inject = ['$http', 'UrlToServerService', 'DataService'];

    function loginServices($http, UrlToServerService, DataService) {
        var callback;
        var token = null;

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
                        token = data.token;
                        localStorage.setItem("token", token);
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
                    data: {token: token},
                    headers: {'Content-Type': 'application/json; charset=UTF-8'}
                });

                request.success(function (data) {
                    token = null;
                    localStorage.removeItem("token");
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
            isLogin: function () {
                return token !== null && token !== undefined;
            }

        };
        return service;
    };
})();