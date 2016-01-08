var app = angular.module('myChat', [
    'ngRoute'
]);

app.run(function (DataService, LoginService) {
    if(LoginService.isLogin()){
        DataService.loadUserData();
    }
});