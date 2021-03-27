'use strict';

class PublicError extends Error {

    constructor(message) {
        super(message);
        this.name = 'PublicError';
    }

}

class ConfigurationError extends PublicError {

    constructor(message) {
        super(message);
        this.name = 'ConfigurationError';
    }

}

class NotFoundError extends PublicError {

    constructor(message) {
        super(message);
        this.name = 'NotFound';
    }

}

class InternalServerError extends PublicError {

    constructor(message) {
        super(message);
        this.name = 'InternalServerError';
    }

}

class ValidatableError extends PublicError {

    constructor(message) {
        super(message);
        this.name = 'Validatable';
        this.details = message;
    }

}

module.exports = {
    ConfigurationError,
    NotFoundError,
    InternalServerError,
    ValidatableError,
    PublicError,
};
