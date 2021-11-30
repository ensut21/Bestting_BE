const { mongodb } = require("../configs/databases");
const mongoose = require("mongoose");

mongodb();

require("./schema/users");
require("./schema/teams");
require("./schema/projects");
require("./schema/boards");
require("./schema/roles");
require("./schema/permissions");
require("./schema/configs");

const conn = mongoose.connection;

conn.on("error", () => console.error.bind(console, "connection error"));

conn.once("open", () => {});

module.exports = conn;
