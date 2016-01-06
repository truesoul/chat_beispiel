(function() {
    'use strict';

    app.factory('UtilService', utilService);

    function utilService() {
       var service = {
           isStringEmpty: function (input){
               return service.isEmpty(input) || input.toString().trim().length == 0;
           }
           ,
           isEmpty: function (input){
               return input === null || input === undefined;
           }
        };
        return service;
    };
})();