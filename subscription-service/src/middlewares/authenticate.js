'use strict';

const _ = require('lodash');
const JWS = require('jws');

const DEFAULT_MAC_ALGORITHM = 'HS512';

class ConfigurationError extends Error {

    constructor(message) {
        super(message);
        this.name = 'ConfigurationError';
    }

}

const ERRORS = {
    MISSING_TOKEN: 'authentication.missing_token',
    INVALID_TOKEN: 'authentication.invalid_token',
    HIJACKED_TOKEN: 'authentication.hijacked_token',
    INVALID_PAYLOAD: 'authentication.invalid_payload',
    EXPIRED_TOKEN: 'authentication.expired_token',
    NOT_SUPPORTED_TOKEN_TYPE: 'authentication.not_supported_token_type',
};

module.exports = ({ secret, output = 'payload' }) => {
    if(!_.isString(secret)) {
        throw new ConfigurationError('invalid token secret');
    }

    if(!_.isString(output)) {
        throw new ConfigurationError('invalid output');
    }

    return (req, res, next) => {
        const authorizationHeader = _.get(req, 'headers.authorization');

        if(!_.isString(authorizationHeader)) {
            return res.status(401).send({
                ok: false,
                error: ERRORS.MISSING_TOKEN,
            });
        }

        const [tokenType, token] = authorizationHeader.split(' ');

        if('bearer' !== _.lowerFirst(tokenType) || !_.isString(token)) {
            return res.status(401).send({
                ok: false,
                error: ERRORS.NOT_SUPPORTED_TOKEN_TYPE,
            });
        }

        let isValidToken;

        try {
            isValidToken = JWS.verify(token, DEFAULT_MAC_ALGORITHM, secret);
        } catch(error) {
            return res.status(401).send({
                ok: false,
                error: ERRORS.INVALID_TOKEN,
            });
        }

        if(!isValidToken) {
            return res.status(401).send({
                ok: false,
                error: ERRORS.HIJACKED_TOKEN,
            });
        }

        const decodedToken = JWS.decode(token);
        // for logging purpose
        req[output] = decodedToken.payload;

        try {
            req[output] = JSON.parse(req[output]);
        } catch(error) {
            return res.status(401).send({
                ok: false,
                error: ERRORS.INVALID_PAYLOAD,
            });
        }

        if(_.isNil(req[output].exp) || _.now() > req[output].exp) {
            return res.status(401).send({
                ok: false,
                error: ERRORS.EXPIRED_TOKEN,
            });
        }

        return next();
    };
};

module.exports.Errors = {
    ConfigurationError,
};
