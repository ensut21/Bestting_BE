var express = require('express');
var app = express();
var morgan = require('morgan');

const { returnError } = require('./helpers/error.helper')

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use(require("./routes"));
// Manage Error
app.use(returnError);

module.exports = app;
