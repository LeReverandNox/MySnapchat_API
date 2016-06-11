var jwt = require('jsonwebtoken');
var config = require('../../config');

module.exports = {
    newToken: function (data) {
        var payload = {
            id: data.id,
            username: data.username,
            email: data.email
        };

        var token = jwt.sign(payload, config.secret, {
                expiresIn: '24h'
        });
        return token;
    },
    checkToken: function (req, res, next) {
        var token = req.body.token || req.query.token;
        if(!token) {
            res.status(403).send({
                error: "Token missing !",
                data: null
            });
        } else {
            jwt.verify(token, config.secret, function (err, decoded) {
                if (err) {
                    res.status(403).send({
                        error: "Your token is invalid.",
                        data: null
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        }
    }
};