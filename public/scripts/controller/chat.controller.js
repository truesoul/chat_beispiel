(function() {
    'use strict';

    app.controller('ChatController', chatController);

    chatController.$inject = ['$scope', 'WebSocketService', 'DataService'];

    function chatController($scope, WebSocketService, DataService) {
        $scope.room = "Mein Chat";
        $scope.users = function () {
            return DataService.getAllUser();
        };

        //WebSocketService.connect();

    };
})();