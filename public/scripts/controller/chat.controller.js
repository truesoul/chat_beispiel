(function() {
    'use strict';

    app.controller('ChatController', chatController);

    chatController.$inject = ['$scope'];

    function chatController($scope) {
        $scope.room = "Mein Chat";
        $scope.textArea = '';
        $scope.inputText = '';

        function clearInput(){
            $scope.inputText = '';
        }

        function isEmpty(value){
            return value !== null && value !== undefined && value.toString().trim().length == 0
        }

        $scope.onSend = function () {
            if(!isEmpty($scope.inputText)){
                $scope.textArea = $scope.textArea + "\n" +$scope.inputText;
            }
            clearInput();
        }

    };
})();