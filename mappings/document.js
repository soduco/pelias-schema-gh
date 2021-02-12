const long = require('./partial/long');

let schema = {
  properties: {
    validtime: {
      type: 'object',
      properties: {
        start: long,
        end: long
      }
    }
  }
};

module.exports = schema;
