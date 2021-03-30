const joi = require('joi');

const subscription = require('./subscription')(joi);
const { ConfigurationError, ValidatableError } = require('../Errors');

const schemas = Object.create({ subscription });

const schemaValidator = (object, type) => {
    return new Promise((resolve, reject) => {
        if (!object) {
            return reject(new ConfigurationError('object to validate not provided'));
        }

        if (!type) {
            return reject(new ConfigurationError('schema type to validate not provided'));
        }

        const { error, value } = joi.object(schemas[type]).validate(object);

        if (error) {
            return reject(new ValidatableError(`invalid ${type} data, err: ${error}`));
        }

        return resolve(value);
    });
}

module.exports = Object.create({ validate: schemaValidator, schemas });
