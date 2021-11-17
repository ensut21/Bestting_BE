const mongoose = require('mongoose');
const config = require('../configs');

const databases = {
    async mongodb() {
        await mongoose.connect(
            `${config.mongo.content_type}://${config.mongo.host}/${config.mongo.dbName}`
        );
    }
};

module.exports = { ...databases }; 