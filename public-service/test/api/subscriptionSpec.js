'use strict';

const _ = require('lodash');
const request = require('supertest');
const { createContainer, asValue } = require('awilix')

const server = require('../../src/server/server');
const middlewares = require('../../src/middlewares');
const models = require('../../src/models');
const { Subscriptions } = require('../../src/Services');
const { createToken } = require('../../src/utilities');

const { serverSettings, subscriptionsApi } = require('../../src/config/config')[process.env.NODE_ENV];

const { expect } = require('../Helpers');

const subscriptions = require('../Examples/subscriptions');

describe('API Subscription', () => {
    let app;
    let token;
    let subscriptionsClone = _.cloneDeep(subscriptions);

    beforeEach(() => {
        const container = createContainer();

        container.register({
            validate: asValue(models.validate),
            serverSettings: asValue(serverSettings),
            subscriptionsApi: asValue(subscriptionsApi),
            createToken: asValue(createToken),
            middlewares: asValue(middlewares),
        });

        return Promise.resolve(new Subscriptions({
                subscriptionsApi: container.resolve('subscriptionsApi'),
                createToken: container.resolve('createToken'),
            }))
            .then(service => {
                container.register({
                    subscriptionService: asValue(service),
                });
            })
            .then(() => server.start(container))
            .then(serv => {
                app = serv;
                return createToken(_.omit(subscriptionsClone[0], '_id'), serverSettings.tokenSecret);
            })
            .then(createdToken => token = createdToken);
    });

    afterEach(() => {
        app.close()
        app = null
    });

    describe('subscriptions', () => {
        it('should return all subscriptions', () => {
            const promise = request(app)
                .get('/subscriptions')
                .set('Authorization', 'bearer ' + token)
                .expect(200)
                .then(response => {
                    const subscriptionsResult = JSON.parse(response.text);
                    expect(subscriptionsResult.ok).to.be.true;
                });

                return promise;
        });
    });
});
