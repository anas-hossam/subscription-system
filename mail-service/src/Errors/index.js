'use strict';

class MailError extends Error {

    constructor(message) {
        super(message);
        this.name = 'MailError';
    }

}

class ConfigurationError extends MailError {

    constructor(message) {
        super(message);
        this.name = 'ConfigurationError';
    }

}


class RateLimitError extends MailError {

    constructor(message) {
        super(message);
        this.name = 'RateLimitError';
    }

}

class BadAuthenticationError extends MailError {

    constructor(message) {
        super(message);
        this.name = 'BadAuthenticationError';
    }

}

class NotFoundError extends MailError {

    constructor(message) {
        super(message);
        this.name = 'NotFound';
    }

}

class InternalServerError extends MailError {

    constructor(message) {
        super(message);
        this.name = 'InternalServerError';
    }

}

class ValidatableError extends MailError {

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
    BadAuthenticationError,
    RateLimitError,
    MailError,
};
