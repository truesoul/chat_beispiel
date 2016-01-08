(function() {
    'use strict';

    app.directive('allUserDirective', allUserDirective);

    allUserDirective.$inject = ['DataService'];

    function allUserDirective(DataService) {
        return {
            restrict: 'E',
            templateUrl: './public/templates/directive/all-user.directive.html',
            scope: {
                data: '='
            },
            controller: function ($scope) {
                $scope.allusers = $scope.data;
            }
        }
    };
})();