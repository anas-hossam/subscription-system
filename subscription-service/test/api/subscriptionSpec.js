'use strict';

const _ = require('lodash');
const request = require('supertest');
const { createContainer, asValue } = require('awilix')

const server = require('../../src/server/server');
const middlewares = require('../../src/middlewares');
const models = require('../../src/models');
const { NotFoundError } = require('../../src/Errors');

const { expect, createToken } = require('../Helpers');

const subscriptions = require('../Examples/subscriptions');

describe('API Subscription', () => {
    let app;
    let token;
    let subscriptionsClone = _.cloneDeep(subscriptions);
    const serverSettings = {
        port: process.env.PORT,
        tokenSecret: process.env.TOKEN_SECRET,
    };

    let testRepo = {
        createSubscription(subscription) {
            return Promise.resolve(subscription);
        },

        getAllSubscriptions() {
            return Promise.resolve(subscriptionsClone);
        },

        getSubscriptionById(id) {
            return Promise.resolve(subscriptionsClone.find(subscription => subscription._id === id));
        },

        getSubscriptionByEmail(email) {
            const subscription = subscriptionsClone.find(subscription => subscription.email === email);

            if (_.isNil(subscription)) {
                return Promise.reject(new NotFoundError());
            }

            return Promise.resolve(subscription);
        },

        cancelSubscription(id) {
            const subscription = subscriptionsClone.find(subscription => subscription._id === id);
            subscription.is_active = false;
            return Promise.resolve(subscription);
        }
    };

    const testMailService = {
        send: () => {
            return Promise.resolve({
                envelope: {
                    from: "hello@addidas.com",
                    to: [
                        "anas-elsayed@outlook.com",
                    ]
                },
                messageId: "abcd-000000@email.amazonses.com",
            });
        }
    };

    beforeEach(() => {
        const container = createContainer();

        container.register({
            validate: asValue(models.validate),
            serverSettings: asValue(serverSettings),
            repo: asValue(testRepo),
            middlewares: asValue(middlewares),
            mailService: asValue(testMailService),
        });

        return server
            .start(container)
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
                        data: {
                            subscriptions: [sample],
                        },
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
                        data: {
                            subscriptions: subscriptionsClone,
                        },
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
                        data: {
                            subscriptions: [subscriptionsClone[0]],
                        },
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
                        data: {
                            subscriptions: [expectedResult],
                        },
                    });
                });

                return promise;
        });
    });
});
