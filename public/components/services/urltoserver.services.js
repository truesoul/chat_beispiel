(function() {
    'use strict';

    app.constant('UrlToServerService', urlToServerServices);

    function urlToServerServices() {
        var service = {
            UrlFromServer: "http://localhost:8080"
            ,
            UrlFromWebSocket: "ws://localhost:8080/"
        };
        return service;
    };
})();