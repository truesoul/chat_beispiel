(function() {
    'use strict';

    app.controller('LoginController', loginController);

    loginController.$inject = ['$scope', '$location', 'LoginService', 'UtilService'];

    function loginController($scope, $location, LoginService, UtilService) {
        var vm = this;

        vm.username = "";
        vm.password = "";

        function success(){
            $location.path('/chat');
        }

        function error(){
            $location.path('/error');
        }

        $scope.sendToServer = function () {
            if(!UtilService.isStringEmpty($scope.username) && !UtilService.isStringEmpty($scope.password)){
                LoginService.login(vm.username, vm.password, success, error);
            }
        }

    };
})();