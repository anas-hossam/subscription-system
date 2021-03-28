'use strict';

const _ = require('lodash');

const HTTP_ERRORS = {
    INVALID_DATA: 'public.invalid_data',
    missingId: id => `public.missing_${id}`,
};

module.exports = ({ subscriptionService }, app) => {
    app.post('/subscribe', (req, res, next) => {
        const { validate } = req.container.cradle;
        const subscription = req.body;
        validate(subscription, 'subscription')
            .then(() => subscriptionService.subscribe(subscription))
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
                    error
                };
        
                if (!_.isNil(details)) {
                    response.details = details;
                }

                return response;
            })  
            .then(response => res.send(response));
    });

    app.put('/unsubscribe/:id', (req, res, next) => {
        const id = req.params.id;

        if (_.isNil(id)) {
            return res.send({
                ok: false,
                error: HTTP_ERRORS.missingId('id'),
            });
        }

        subscriptionService.unsubscribe(id)
            .then(response => res.send(response));
    });

    app.get('/subscription/:id', (req, res, next) => {
        const id = req.params.id;

        if (_.isNil(id)) {
            return res.send({
                ok: false,
                error: HTTP_ERRORS.missingId('id'),
            });
        }

        subscriptionService.get(id)
            .then(response => res.send(response));
    });

    app.get('/subscriptions', (req, res, next) => {
        subscriptionService.list()
            .then(response => res.send(response));
    });
}
