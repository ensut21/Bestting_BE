var express = require("express");
var app = express();
var morgan = require("morgan");

require("./models");

const { returnError } = require("./helpers/error.helper");
const { ErrorNotFound } = require("./configs/errorMetods");

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use(require("./routes"));
// Manage Error
app.use(returnError);

app.use(function (req, res, next) {
  res.status(404).json(ErrorNotFound('Unkonw Url.'));
});

// app.listen(3001, () => console.log("server started"));

module.exports = app;
