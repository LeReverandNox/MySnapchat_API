var express = require('express');
var router = express.Router();
var User = require('../controllers/User.js');
var jwt = require('../lib/jwt');
var fieldsValidator = require('../lib/fields-validator');

module.exports = function (app) {
    'use strict';
    router.route('/')
        .get(jwt.checkToken, User.myFriends)
        .post(jwt.checkToken, fieldsValidator(['email'], true), User.addFriend);
    router.get('/requests', jwt.checkToken, User.friendRequests);
    router.delete('/:friend_id', jwt.checkToken, User.deleteFriend);
    app.use('/api/friends', router);
};