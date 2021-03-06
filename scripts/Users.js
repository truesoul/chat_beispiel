
var Users = [];

module.exports = {
    addToUsers: function (data, success, error) {
        Users.push(data);
        success();
    }
    ,
    removeUserByToken: function (token, success, error) {
        var isLogout = false;

        for(var i = 0; i < Users.length;i++){
            if(Users[i].token == token){
                Users.splice(i, 1);
                isLogout = true;
                break;
            }
        }
        if(isLogout){
            success();
        } else {
            error();
        }
    }
    ,
    getAllUser: function () {
        var usernames = [];
        for(var i = 0; i < Users.length;i++){
            usernames.push(Users[i].user.username);
        }
        return usernames;
    }
    ,
    findByToken: function (token, callback) {
        var user = null;
        for(var i = 0; i < Users.length;i++){
            if(Users[i].token == token){
                user = Users[i].user.username;
                break;
            }
        }
        callback(user);
    }
};
