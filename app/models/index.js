var fs = require('fs');
var env = process.env.NODE_ENV || "development";
var config = require('../../config')[env];
var Sequelize = require('sequelize');
var db = {};

var sequelize = new Sequelize(config.database, config.username, config.password, {"host": config.host, "port": config.port});

fs.readdirSync(__dirname).forEach(function (file) {
    if (file.slice(-3) === '.js' && file !== "index.js") {
        var model = sequelize.import('./' + file);
        db[model.name] = model;
    }
});

Object.keys(db).forEach(function (modelName) {
    if (db[modelName].associate !== undefined) {
        db[modelName].associate(db);
    }
});

module.exports = db;