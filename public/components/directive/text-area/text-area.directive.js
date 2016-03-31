(function() {
    'use strict';

    app.directive('textAreaDirective', textAreaDirective);

    textAreaDirective.$inject = ['ChatService'];

    function textAreaDirective(ChatService) {
        return {
            restrict: 'E',
            templateUrl: './public/components/directive/text-area/text-area.directive.html',
            controller: function ($scope) {
                $scope.inputText = '';
                $scope.selectedColor = '#000000';

                function clearInput(){
                    $scope.inputText = '';
                    var input = document.getElementById('inputText');
                    if(input){
                        input.focus();
                    }
                }

                function createElementInDiv(input, color){
                    var area = document.getElementById("textArea");
                    var span = document.createElement("span");
                    span.style.color = color;
                    var node = document.createTextNode(input);
                    var br = document.createElement("br");

                    span.appendChild(node);
                    span.appendChild(br);
                    area.appendChild(span);
                    scrollToBottom();
                }


                ChatService.onCallback(createElementInDiv);

                function scrollToBottom(){
                    var area = document.getElementById("textArea");
                    area.scrollTop = area.scrollHeight;
                }

                $scope.onSend = function () {
                    ChatService.send($scope.inputText, $scope.selectedColor);
                    clearInput();
                }
            }
        }
    };
})();