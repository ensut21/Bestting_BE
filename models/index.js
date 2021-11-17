const { mongodb } = require("../configs/databases");

mongodb();

require("./schema/users");
