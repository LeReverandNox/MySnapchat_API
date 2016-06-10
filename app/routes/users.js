var express = require('express');
var router = express.Router();
var User = require('../controllers/User.js');

var toto = function (req, res, next) {
    if (req.query.sexe === "bite") {
        next();
    } else {
        res.status(403).send({
            error: "Bad token",
            data: null
        });
    }
};

module.exports = function (app) {
    router.get('/', toto, User.all);
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