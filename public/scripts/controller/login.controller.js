(function() {
    'use strict';

    app.controller('LoginController', loginController);

    loginController.$inject = ['$scope', '$location', 'LoginService', 'UtilService'];

    function loginController($scope, $location, LoginService, UtilService) {
        $scope.username = "";
        $scope.password = "";

        function success(){
            $location.path('/chat');
        }

        function error(){
            $location.path('/error');
        }

        $scope.sendToServer = function () {
            if(!UtilService.isStringEmpty($scope.username) && !UtilService.isStringEmpty($scope.password)){
                LoginService.login($scope.username, $scope.password, success, error);
            }
        }

    };
})();