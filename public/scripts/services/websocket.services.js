(function() {
    'use strict';

    app.factory('WebSocketService', webSocketService);

    webSocketService.$inject = ['ChatService', 'UrlToServerService', 'DataService'];

    function webSocketService(ChatService, UrlToServerService, DataService) {
        var ws = null;
        var key = null;
        var isOpen = false;

        var service = {
            connect: function (){
                service.disconnect();
                ws = new WebSocket(UrlToServerService.getUrlFromWebSocket());
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
                                if(obj.command == 'addComment'){
                                    ChatService.setInput(obj.data.message, obj.data.color);
                                } else if(obj.command == 'addUser' || obj.command == 'removeUser'){
                                    DataService.loadUserData();
                                }
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