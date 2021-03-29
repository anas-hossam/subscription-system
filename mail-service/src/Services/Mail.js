'use strict';

const _ = require('lodash');

const nodemailer = require('nodemailer');
const sesTransport = require('nodemailer-ses-transport');

const { ConfigurationError, InternalServerError, BadAuthenticationError } = require('../Errors');

class Mail {

    constructor(deps) {
        if (
            !_.isPlainObject(deps) ||
            !_.isPlainObject(deps.config) ||
            !_.isString(deps.config.client_id) ||
            !_.isString(deps.config.client_secret) ||
            !_.isString(deps.config.from_email) ||
            !_.isFunction(deps.formatMail)
        ) {
            throw new ConfigurationError('missing or invalid deps');
        }

        this.config = deps.config
        this.transporter = this._createTransporter(this.config);
        this.formatter = deps.formatMail;
    }

    send(email) {
        return this.formatter(email, this.config.from_email)
            .then(formattedMail => this.transporter.sendMail(formattedMail))
            .then(response => {
                const result = {
                    from: response.envelope.from,
                    to: response.envelope.to,
                    message_id: response.messageId,
                };
                
                _.assign(result, _.pick(email, ['cc', 'bcc']));

                return result;
            })
            .catch(err => this._wrapResponseError(err));
    }

    _createTransporter(config) {
        return nodemailer.createTransport(
            sesTransport({
                accessKeyId: config.client_id,
                secretAccessKey: config.client_secret,
                region: 'us-east-1',
            })
        );
    }

    _wrapResponseError(err) {
        let errorInstance;
        const statusCode = err.statusCode;
        const errorCode = err.code;
        const errorMessage = err.message;

        if ((400 === statusCode || 403 === statusCode)
            && ('AccessDeniedException' === errorCode
                || 'IncompleteSignature' === errorCode
                || 'InvalidClientTokenId' === errorCode
                || 'SignatureDoesNotMatch' === errorCode
                || 'MissingAuthenticationToken' === errorCode
                || 'RequestExpired' === errorCode)) {
            errorInstance = new BadAuthenticationError();
        } else if ((400 === statusCode || 404 === statusCode)
            && ('InvalidAction' === errorCode
                || 'MissingAction' === errorCode
                || 'MissingParameter' === errorCode
                || 'OptInRequired' === errorCode
                || 'ValidationError' === errorCode
                || 'MailFromDomainNotVerified' === errorCode
                || 'MessageRejected' === errorCode)) {
            errorInstance = new ConfigurationError();
        } else if (400 === statusCode && 'ThrottlingException' === errorCode) {
            errorInstance = new RateLimitError();
        } else if (503 === statusCode || 500 === statusCode
            && ('ServiceUnavailable' === errorCode
                || 'InternalFailure' === errorCode)) {
            errorInstance = new InternalServerError();
        } else {
            errorInstance = new ConfigurationError();
        }

        errorInstance.details = { message: errorMessage, statusCode };

        throw errorInstance;
    }

}

module.exports = Mail;
