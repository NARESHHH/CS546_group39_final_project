const ClientError = require("../shared/client-error");
const ServerError = require("../shared/server-error");

module.exports = async (error, req, res, next) => {
  console.log(error.message);
  if (error instanceof ServerError) {
    const status = error.status;
    const message = error.message;
    return res.status(status).send({ message: message });
  }

  const status = 500;
  const message = error.message;
  return res.status(status).send({ message: message });
};
