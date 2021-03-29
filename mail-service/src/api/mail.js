'use strict';

const _ = require('lodash');

const HTTP_ERRORS = {
    INVALID_DATA: 'mail.invalid_data',
    internal: 'mail.internal_server_error',
};

module.exports = ({ mailService }, app) => {
    app.post('/sendMail', (req, res, next) => {
        const { validate } = req.container.cradle;
        const subscription = req.body;
        validate(subscription, 'subscription')
            .then(() => mailService.send(subscription))
            .catch(err => {
                let error;
                let details;

                if ('Validatable' === err.name) {
                    error = HTTP_ERRORS.INVALID_DATA;
                    details = err.details;
                } else {
                    error = HTTP_ERRORS.internal;
                    details = err.details || err.message;
                }

                const response = {
                    ok: false,
                    error,
                };
        
                if (!_.isNil(details)) {
                    response.details = details;
                }

                return response;
            })  
            .then(response => res.send(response));
    });
}
