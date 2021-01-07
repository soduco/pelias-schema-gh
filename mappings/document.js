const strict_date = require('./partial/strict_date');

let schema = {
  properties: {
    valid_time: {
      type: 'object',
      properties: {
        start: strict_date,
        end: strict_date
      }
    }
  }
};

module.exports = schema;
