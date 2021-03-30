'use strict';

const _ = require('lodash');

const HTTP_ERRORS = {
    INVALID_DATA: 'subscription.invalid_data',
    NOT_EXISTING: 'subscription.not_existing',
    missingId: id => `subscription.missing_${id}`,
    internal: 'subscription.internal_server_error',
};

const respond = promise =>
    promise
    .then(response => {
        if(!_.isNil(_.get(response, 'repositoryResponse.ok'))) {
            return response.repositoryResponse;
        }
    
        // TODO adding pub/sub to publish logs of mailResponse service on Logdna/Kibana

        if (!_.isArray(response)) {
            response = [response.repositoryResponse ? response.repositoryResponse : response];
        }
        

        return {
            ok: true,
            data: { subscriptions: response },
        };
    })
    .catch(err => {
        let error;
        let details;

        if ('NotFound' === err.name) {
            error = HTTP_ERRORS.NOT_EXISTING;
        } else if ('Validatable' === err.name) {
            error = HTTP_ERRORS.INVALID_DATA;
            details = err.details;
        } else {
            error = HTTP_ERRORS.internal;
        }

        const response = {
            ok: false,
            error,
        };

        if (!_.isNil(details)) {
            response.details = details;
        }

        return response;
    });

module.exports = ({ repo, mailService }, app) => {
    app.post('/subscribe', (req, res) => {
        let repositoryResponse;
        const { validate } = req.container.cradle;
        const subscription = req.body;
        const promise = validate(subscription, 'subscription')
            .then(() => repo.getSubscriptionByEmail(subscription.email))
            .then(() => {
                return { ok: false, error: 'your email is already subscribed' };
            })
            .catch(err => {
                if (err.name == 'NotFound') {
                    return repo.createSubscription(subscription);
                }

                throw err;
            })
            .then(response => {
                repositoryResponse = response;
                return mailService.send(_.omit(subscription, '_id'));
            })
            .catch(err => err)
            .then(mailResponse => {
                return {
                    repositoryResponse,
                    mailResponse,
                };
            });

        return respond(promise).then(response => res.send(response));
    });

    app.put('/unsubscribe/:id', (req, res) => {
        const id = req.params.id;
        if (_.isNil(id)) {
            return res.send({
                ok: false,
                error: HTTP_ERRORS.missingId('id'),
            });
        }

        const promise = repo.cancelSubscription(id);
        return respond(promise).then(response => res.send(response));
    });

    app.get('/subscription/:id', (req, res) => {
        const id = req.params.id;
        if (_.isNil(id)) {
            return res.send({
                ok: false,
                error: HTTP_ERRORS.missingId('id'),
            });
        }

        const promise = repo.getSubscriptionById(id);
        return respond(promise).then(response => res.send(response));
    });

    app.get('/subscriptions', (req, res) => {
        const promise = repo.getAllSubscriptions();
        return respond(promise).then(response => res.send(response));
    });
};
