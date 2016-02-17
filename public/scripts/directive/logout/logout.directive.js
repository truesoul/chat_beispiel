(function() {
    'use strict';

    app.directive('logoutDirective', logoutDirective);

    logoutDirective.$inject = ['LoginService', '$location'];

    function logoutDirective(LoginService, $location) {
        return {
            restrict: 'E',
            template: '<input type="button" data-ng-click="logout()" value="Abmelden" data-ng-if="isLogin()" >',
            controller: function ($scope) {
                $scope.isLogin = function () {
                    return LoginService.isLogin();
                };

                var callback = function () {
                    $location.path('/login');
                };

                $scope.logout = function () {
                    LoginService.logout(callback, callback);
                }
            }
        }
    };
})();