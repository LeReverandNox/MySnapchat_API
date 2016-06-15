var express = require('express');
var router = express.Router();
var User = require('../controllers/User.js');
var jwt = require('../lib/jwt');
var fieldsValidator = require('../lib/fields-validator');

module.exports = function (app) {
    'use strict';
    router.get('/', jwt.checkToken, User.all);
    router.post('/login', fieldsValidator(['email', 'password'], true), User.login);
    router.post('/register', fieldsValidator(['email', 'password', 'username'], true), User.register);
    router.route('/friends')
        .get(User.myFriends)
        .post(User.addFriend);
    router.get('/friends/requests', User.friendRequests);
    router.delete('/friends/:friend_id', User.deleteFriend);
    router.route('/:user_id')
        .get(jwt.checkToken, User.oneUser)
        .patch(jwt.checkToken, fieldsValidator(['password'], true), User.changePassword);
    app.use('/api/users', router);
};