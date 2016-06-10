var express = require('express');
var router = express.Router();
var User = require('../controllers/User.js');
var jwt = require('../lib/jwt');

module.exports = function (app) {
    router.get('/', jwt.checkToken, User.all);
    router.post('/login', User.login);
    router.post('/register', User.register);
    router.get('/friends', User.myFriends);
    router.post('/friends', User.addFriend);
    router.get('/friends/requests', User.friendRequests);
    router.delete('/friends/:friend_id', User.deleteFriend);
    router.get('/:user_id', User.oneUser);
    router.put('/:user_id', User.changePassword);

    app.use('/api/users', router);
};