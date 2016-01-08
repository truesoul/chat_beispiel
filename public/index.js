var app = angular.module('myChat', [
    'ngRoute'
]);

app.run(function (DataService, LoginService,WebSocketService) {
    if(LoginService.isLogin()){
        DataService.loadUserData();
        WebSocketService.connect();
    }
});