const mongoose = require("mongoose");
const Users = mongoose.model('Users')

const methods = {
    create(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await Users.create(data);
                resolve(user);
            } catch (error) {
                reject(error);
            }
        });
    },
    findById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await Users.findById(id);
                resolve(user);
            } catch (error) {
                reject(error);
            }
        });
    }
};

module.exports = { ...methods };
