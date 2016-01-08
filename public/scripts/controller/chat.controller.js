(function() {
    'use strict';

    app.controller('ChatController', chatController);

    chatController.$inject = ['$scope', 'DataService'];

    function chatController($scope, DataService) {
        $scope.room = "Mein Chat";
    };
})();