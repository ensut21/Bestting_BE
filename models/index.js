const { mongodb } = require("../configs/databases");
const mongoose = require("mongoose");

mongodb();

require("./schema/users");
require("./schema/teams");
require("./schema/roles");
require("./schema/permissions");

const conn = mongoose.connection;

conn.on("error", () => console.error.bind(console, "connection error"));

conn.once("open", () => {});

module.exports = conn;
