'use strict';

const _ = require('lodash');
const request = require('supertest');
const { createContainer, asValue } = require('awilix')

const server = require('../../src/server/server');
const middlewares = require('../../src/middlewares');
const models = require('../../src/models');
// const { Mail } = require('../../src/Services');
const { formatMail } = require('../../src/utilities');

const { serverSettings, mailSettings } = require('../../src/config/config')[process.env.NODE_ENV];

const { expect, createToken } = require('../Helpers');

const subscriptions = require('../Examples/subscriptions');

describe('API Mail', () => {
    let app;
    let token;
    let subscriptionsClone = _.cloneDeep(subscriptions);

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
            mailSettings: asValue(mailSettings),
            formatMail: asValue(formatMail),
            middlewares: asValue(middlewares),
            mailService: asValue(testMailService),
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

    describe('mail', () => {
        it('should send email', () => {
            const sample = _.omit(subscriptionsClone[0], '_id');
            const promise = request(app)
                .post('/sendMail')
                .set('Authorization', 'bearer ' + token)
                .send({ subscription: sample })
                .expect(200)
                .then(response => {
                    const subscriptionsResult = JSON.parse(response.text);
                    expect(subscriptionsResult).to.deep.equal({
                        envelope: {
                            from: "hello@addidas.com",
                            to: [
                                "anas-elsayed@outlook.com",
                            ]
                        },
                        messageId: "abcd-000000@email.amazonses.com",
                    });
                });

                return promise;
        });
    });
});
