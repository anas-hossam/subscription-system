'use strict';

class SubscriptionsError extends Error {

    constructor(message) {
        super(message);
        this.name = 'SubscriptionsError';
    }

}

class ConfigurationError extends SubscriptionsError {

    constructor(message) {
        super(message);
        this.name = 'ConfigurationError';
    }

}

class NotFoundError extends SubscriptionsError {

    constructor(message) {
        super(message);
        this.name = 'NotFound';
    }

}

class InternalServerError extends SubscriptionsError {

    constructor(message) {
        super(message);
        this.name = 'InternalServerError';
    }

}

class ValidatableError extends SubscriptionsError {

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
    SubscriptionsError,
};
