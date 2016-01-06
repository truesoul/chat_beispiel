(function() {
    'use strict';

    app.controller('ChatController', chatController);

    chatController.$inject = ['$scope'];

    function chatController($scope) {
        $scope.room = "Mein Chat";
    };
})();