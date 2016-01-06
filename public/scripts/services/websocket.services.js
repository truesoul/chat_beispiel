(function() {
    'use strict';

    app.factory('WebSocketService', webSocketService);

    webSocketService.$inject = ['ChatService', 'UrlToServerServices'];

    function webSocketService(ChatService, UrlToServerServices) {
        var ws = null;
        var key = null;
        var isOpen = false;

        var service = {
            connect: function (){
                ws = new WebSocket(UrlToServerServices.getUrlFromWebSocket());
                ws.onopen = function(data){
                    console.log("Socket has been opened!");
                    isOpen = true;
                };

                ws.onclose = function (err, reason) {
                    console.log(err);
                    isOpen = false;
                    key = null;
                };

                ws.onmessage = function(message) {
                    var obj = JSON.parse(message.data);
                    if(isOpen){
                        if(!key){
                            if(obj.key){
                                key = obj.key;
                            }
                        } else {
                            if(key != obj.key){
                                ChatService.setInput(obj.message, obj.color);
                            }
                        }
                    }
                };
            }
            ,
            disconnect: function () {
                if(ws){
                    ws.close();
                }
            }
        };
        return service;
    };
})();