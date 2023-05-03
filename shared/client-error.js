class ClientError extends Error {
  /**
 *
 * @param {*} status
 * @param {*} message
 * @param {*} description
 */
  constructor(id, message, description ='') {
    super(message);
    this.id = id;
    this.message = message;
    this.description = description;
  }
}

module.exports = ClientError;
