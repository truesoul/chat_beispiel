(function() {
    'use strict';

    app.directive('textAreaDirective', textAreaDirective);

    function textAreaDirective() {
        return {
            restrict: 'E',
            templateUrl: './public/templates/directive/text-area.directive.html',
            controller: function ($scope) {

                $scope.selectedColor = '#000000';

                function clearInput(){
                    $scope.inputText = '';
                }

                function isEmpty(value){
                    return value !== null && value !== undefined && value.toString().trim().length == 0
                }

                function createElementInDiv(){
                    var area = document.getElementById("textArea");
                    var span = document.createElement("span");
                    span.style.color = $scope.selectedColor;
                    var node = document.createTextNode($scope.inputText);
                    var br = document.createElement("br");

                    span.appendChild(node);
                    span.appendChild(br);
                    area.appendChild(span);
                }

                function scrollToBottom(){
                    var area = document.getElementById("textArea");
                    area.scrollTop = area.scrollHeight;
                }

                $scope.onSend = function () {
                    if(!isEmpty($scope.inputText)){
                        createElementInDiv();
                        scrollToBottom();
                    }
                    clearInput();
                }

            }
        }
    };
})();