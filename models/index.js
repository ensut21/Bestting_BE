const { mongodb } = require("../configs/databases");
const mongoose = require("mongoose");

mongodb();

require("./schema/users");
require("./schema/teams");

const conn = mongoose.connection;

conn.on('error', () => console.error.bind(console, 'connection error'));

conn.once('open', () => console.log('Connection to Database is successful'));

module.exports = conn;