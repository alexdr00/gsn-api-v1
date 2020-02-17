/*
* Global Joi configuration
* */

const Joi = require('@hapi/joi');

module.exports = Joi.defaults((schema) => (
  schema.options({
    abortEarly: false,
  })
));
