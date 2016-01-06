(function() {
    'use strict';

    app.factory('ChatService', chatService);

    chatService.$inject = ['$http', '$timeout', 'UtilService'];

    function chatService($http, $timeout, UtilService) {
        var callback;

        var service = {
            send: function (input, color){
                if(!UtilService.isStringEmpty(input)){
                    service.setInput(input, color);
                }
            }
            ,
            onCallback: function (_callback) {
                callback = _callback;
            }
            ,
            setInput: function (input, color) {
                if(callback){
                    callback(input, color);
                }
            }
        };
        return service;
    };
})();