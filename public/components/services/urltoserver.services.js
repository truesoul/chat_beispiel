(function() {
    'use strict';

    app.constant('UrlToServerServices', urlToServerServices);

    function urlToServerServices() {
         var service = {
            UrlFromServer: "http://localhost:8080"
            ,
            UrlFromWebSocket: "ws://localhost:8080/"
        };
        return service;
    }
})();