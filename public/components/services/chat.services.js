(function() {
    'use strict';

    app.factory('ChatService', chatService);

    chatService.$inject = ['$http', 'UtilService','UrlToServerService'];

    function chatService($http, UtilService,UrlToServerService) {
        var callback;

        var service = {
            send: function (input, color){
                if(!UtilService.isStringEmpty(input)){
                    var request = $http({
                        method: "post",
                        url: UrlToServerService.UrlFromServer+"/addcomment",
                        data: {token: localStorage.getItem("token"), message: input, color: color},
                        headers: {'Content-Type': 'application/json; charset=UTF-8'}
                    });

                    request.success(function (data) {

                    });
                    request.error(function (data, status, headers, config) {

                    });
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