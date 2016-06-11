var express = require('express');
var router = express.Router();
var Snap = require('../controllers/Snap');
var jwt = require('../lib/jwt');
var fieldsValidator = require('../lib/fields-validator');
var snapValidator = require('../lib/snap-validator');
var multer = require('multer');
var config = require('../../config');

module.exports = function (app) {
    'use strict';
    router.post('/', multer({dest: config.upload_folder}).any(), jwt.checkToken, fieldsValidator(['email', 'u2', 'temps'], true), snapValidator, Snap.newSnap);

    app.use('/api/snaps', router);
};