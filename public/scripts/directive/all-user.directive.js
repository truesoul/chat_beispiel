(function() {
    'use strict';

    app.directive('allUserDirective', allUserDirective);

    allUserDirective.$inject = ['DataService'];

    function allUserDirective(DataService) {
        return {
            restrict: 'E',
            templateUrl: './public/templates/directive/all-user.directive.html',
            controller: function ($scope) {
                $scope.allusers = function () {
                    return DataService.getAllUser();
                }
            }
        }
    };
})();