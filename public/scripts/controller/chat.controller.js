(function() {
    'use strict';

    app.controller('ChatController', chatController);

    chatController.$inject = ['$scope', 'WebSocketService'];

    function chatController($scope, WebSocketService) {
        $scope.room = "Mein Chat";
        //WebSocketService.connect();

    };
})();