module.exports = {
  Success(data) {
    let success = {
      status: "Success",
      statusCode: 200,
      data,
    };
    return success;
  },
  SuccessCreated(data) {
    let success = {
      status: "Created",
      statusCode: 201,
      data,
    };
    return success;
  },
  SuccessUpdated(data) {
    let success = {
      status: "Updated",
      statusCode: 200,
      data,
    };
    return success;
  },
  SuccessDeleted() {
    let success = {
      status: "Deleted",
      statusCode: 204,
    };
    return success;
  },
};
