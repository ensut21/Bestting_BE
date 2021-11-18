const mongoose = require("mongoose");
const config = require("../configs");

const databases = {
  async mongodb() {
    await mongoose.connect(
      `${config.mongo.content_type}://${config.mongo.options.user}:${config.mongo.options.pass}@${config.mongo.host}/${config.mongo.dbName}?retryWrites=true&w=majority`
    );
  },
};

module.exports = { ...databases };
