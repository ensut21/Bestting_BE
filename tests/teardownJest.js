require("../models");

const mongoose = require("mongoose");
const Users = mongoose.model("Users");
const Teams = mongoose.model("Teams");
const Projects = mongoose.model("Projects");
const Boards = mongoose.model("Boards");
const Permissions = mongoose.model("Permissions");

const teardown = async () => {
  await Users.deleteMany();
  await Teams.deleteMany();
  await Projects.deleteMany();
  await Boards.deleteMany();
  await Permissions.deleteMany();
};

module.exports = teardown;
