const _ = require('lodash');
const { asValue } = require('awilix');
const { EventEmitter } = require('events');

const expect = require('../Helpers/expect');
const { dbSettings } = require('../../src/config/config')[process.env.NODE_ENV];

const repository = require('../../src/repository/subscription');
const { InternalServerError, ValidatableError, NotFoundError } = require('../../src/Errors');
const dropMongoDb = require('../Helpers/dropMongoDb');
const di = require('../../src/config');
const subscriptions = require('../Examples/subscriptions');

const mediator = new EventEmitter();

describe('Repository/Subscription', () => {
    let subscriptionRepo;
    let createdSubscriptionId;

    before(() => dropMongoDb(dbSettings.dbUrl, dbSettings.db)
        .then(() => {
            mediator.on('di.ready', (container) => {     
                return repository.connect(container)
                    .then(repo => {
                        container.register({ repo: asValue(repo) });
                        subscriptionRepo = container.resolve('repo');
                        return subscriptionRepo;
                    });
            });
            
            di.init(mediator);
            mediator.emit('init');
        })
    );

    after(() => dropMongoDb(dbSettings.dbUrl, dbSettings.db));


    describe('connect', () => {
        it('should return error if no connection db', () => {
            const fn = repository.connect({});
            return expect(fn).to.be.eventually.rejectedWith(InternalServerError)
                .and.to.have.property('message').that.deep.equals(
                    'connection db not supplied!',
                );
        });
    });

    describe('createSubscription', () => {
        it('should create subscription', () => {
            return subscriptionRepo.createSubscription(_.omit(subscriptions[0], '_id'))
                .then(createdSubscription => {
                    createdSubscriptionId = createdSubscription._id.toString();
                    expect(createdSubscription).to.have.keys('_id');
                })
        });
    });

    describe('getSubscriptionById', () => {
        it('should get subscription by id', () => {
            return subscriptionRepo.getSubscriptionById(createdSubscriptionId)
            .then(result =>
                expect(_.omit(result, '_id')).to.deep.equal(_.omit(subscriptions[0], '_id')));
        });

        it('should throw validatable error if invalid id', () => {
            return expect(subscriptionRepo.getSubscriptionById('invalid-id'))
                .to.be.eventually.rejectedWith(ValidatableError)
                .and.to.have.property('message').that.deep.equals(
                    'invalid id',
                );
        });

        it('should throw not found error if id is not existing', () => {
            return expect(subscriptionRepo.getSubscriptionById(_.repeat('a', 24)))
                .to.be.eventually.rejectedWith(NotFoundError);
        });
    });

    describe('cancelSubscription', () => {
        it('should cancel subscription', () => {
            return subscriptionRepo.cancelSubscription(createdSubscriptionId)
            .then(result => expect(result.is_active).to.equal(false));
        });
    });

    describe('getSubscriptionByEmail', () => {
        it('should get subscription by email', () => {
            return subscriptionRepo.getSubscriptionByEmail(subscriptions[0].email)
            .then(result =>
                expect(_.omit(result, ['_id', 'is_active']))
                    .to.deep.equal(_.omit(subscriptions[0], ['_id', 'is_active'])))
        });
    });

    describe('getAllSubscriptions', () => {
        it('should get all subscriptions', () => {
            return subscriptionRepo.getAllSubscriptions()
            .then(result => {
                expect(result.length).to.equal(1);
                expect(_.omit(result[0], ['_id', 'is_active']))
                    .to.deep.equal(_.omit(subscriptions[0], ['_id', 'is_active']))
            })
        });
    });

});
