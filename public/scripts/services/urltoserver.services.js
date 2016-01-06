(function() {
    'use strict';

    app.factory('UrlToServerService', urlToServerServices);

    function urlToServerServices($http, $timeout, UtilService) {
        var callback;

        var service = {
            getUrlFromServer: function () {
                return "http://localhost:8080";
            }
            ,
            getUrlFromWebSocket: function () {
                return "ws://localhost:8080/";
            }
        };
        return service;
    };
})();