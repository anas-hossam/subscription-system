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

    let testSubscriptionService = {
        subscribe(subscription) {
            return Promise.resolve({
                ok: true,
                data: [subscription],
            });
        },

        list() {
            return Promise.resolve({
                ok: true,
                data: subscriptionsClone,
            });
        },

        get(id) {
            return Promise.resolve({
                ok: true,
                data: [subscriptionsClone.find(subscription => subscription._id === id)],
            });
        },

        unsubscribe(id) {
            const subscription = subscriptionsClone.find(subscription => subscription._id === id);
            subscription.is_active = false;
            return Promise.resolve({
                ok: true,
                data: [subscription]
            });
        }
    };

    beforeEach(() => {
        const container = createContainer();

        container.register({
            validate: asValue(models.validate),
            serverSettings: asValue(serverSettings),
            subscriptionsApi: asValue(subscriptionsApi),
            createToken: asValue(createToken),
            middlewares: asValue(middlewares),
            subscriptionService: asValue(testSubscriptionService),
        });

        return server.start(container)
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

    describe('subscribe', () => {
        it('should create subscription', () => {
            const sample = _.omit(subscriptions[0], '_id');
            subscriptionsClone.shift();

            const promise = request(app)
                .post('/subscribe')
                .set('Authorization', 'bearer ' + token)
                .send(sample)
                .expect(200)
                .then(response => {
                    const subscriptionsResult = JSON.parse(response.text);
                    expect(subscriptionsResult).to.deep.equal({
                        ok: true,
                        data: [sample],
                    });
                });

                return promise;
        });
    });

    describe('subscriptions', () => {
        it('should return all subscriptions', () => {
            const promise = request(app)
                .get('/subscriptions')
                .set('Authorization', 'bearer ' + token)
                .expect(200)
                .then(response => {
                    const subscriptionsResult = JSON.parse(response.text);
                    expect(subscriptionsResult).to.deep.equal({
                        ok: true,
                        data: subscriptionsClone,
                    });
                });

                return promise;
        });
    });

    describe('subscription/:id', () => {
        it('should get subscription by id', () => {
            const promise = request(app)
                .get(`/subscription/${subscriptionsClone[0]._id}`)
                .set('Authorization', 'bearer ' + token)
                .expect(200)
                .then(response => {
                    const subscriptionsResult = JSON.parse(response.text);
                    expect(subscriptionsResult).to.deep.equal({
                        ok: true,
                        data: [subscriptionsClone[0]],
                    });
                });

                return promise;
        });
    });

    describe('unsubscribe/:id', () => {
        it('should cancel subscription by id', () => {
            const promise = request(app)
                .put(`/unsubscribe/${subscriptionsClone[0]._id}`)
                .set('Authorization', 'bearer ' + token)
                .expect(200)
                .then(response => {
                    const subscriptionsResult = JSON.parse(response.text);
                    const expectedResult = _.cloneDeep(subscriptionsClone[0]);
                    expectedResult.is_active = false;

                    expect(subscriptionsResult).to.deep.equal({
                        ok: true,
                        data: [expectedResult],
                    });
                });

                return promise;
        });
    });
});
