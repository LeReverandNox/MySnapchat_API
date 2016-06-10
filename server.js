var config = require('./config');

var express = require('express');
var app = express();

// Chargement des routes
require('./app/routes')(app);

app.listen(config.server_port);
