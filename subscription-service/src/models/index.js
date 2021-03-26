const joi = require('joi');
const subscription = require('./subscription')(joi);

const schemas = Object.create({ subscription });

const schemaValidator = (object, type) => {
    return new Promise((resolve, reject) => {
        if (!object) {
            reject(new Error('object to validate not provided'))
        }

        if (!type) {
            reject(new Error('schema type to validate not provided'))
        }

        const { error, value } = joi.object(schemas[type]).validate(object);

        if (error) {
            reject(new Error(`invalid ${type} data, err: ${error}`))
        }

        resolve(value);
    });
}

module.exports = Object.create({ validate: schemaValidator, schemas });
