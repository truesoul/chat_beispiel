(function() {
    'use strict';

    app.directive('enterPress', enterPressDirective);

    function enterPressDirective() {
        return {
            restrict: 'A',
            link: function(scope, elm, attrs) {
                var ENTER_CODE = 13;
                var outerFn = scope.$eval(attrs.enterPress);
                elm.bind('keypress', function(evt){
                    scope.$apply(function() {
                        if(evt.keyCode == ENTER_CODE){
                            if(outerFn){
                                outerFn.call(scope, evt.which);
                            }
                        }
                    });
                });
            }
        }
    };
})();