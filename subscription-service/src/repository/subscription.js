'use strict';

const _ = require('lodash');

const { InternalServerError, NotFoundError, ValidatableError } = require('../Errors');

const repository = (container) => {
    const { database: db } = container.cradle;
    const collection = db.collection('subscriptions');

    const createSubscription = subscription => {
        return new Promise((resolve, reject) => {
            collection.insertOne(subscription, (err, { ops: [result] }) => {
                if (err) {
                    return reject(new InternalServerError('An error occurred creating a subscription, err:' + err));
                }

                return resolve({ _id: result._id });
            });
        });
    };

    const cancelSubscription = subscriptionId =>
        _findById(subscriptionId, { $set: { is_active: false } }, true);

    const getSubscriptionById = subscriptionId => _findById(subscriptionId);

    const getSubscriptionByEmail = email => _findByEmail(email);

    const getAllSubscriptions = () => {
        return new Promise((resolve, reject) => {
            const subscriptions = [];
            const cursor = collection.find({});
            const addSubscription = (subscription) => {
                subscriptions.push(subscription)
            };

            const sendSubscriptions = (err) => {
                if (err) {
                    return reject(
                        new InternalServerError(
                            'An error occurred fetching all subscriptions, err:' + err,
                        )
                    );
                }

                return resolve(subscriptions.slice());
            };

            cursor.forEach(addSubscription, sendSubscriptions);
        });
    };

    const disconnect = () => {
        db.close()
    };

    const _findById = (id, projection = {}, findAndUpdate = false) => {
        return new Promise((resolve, reject) => {
            const ObjectID = container.resolve('ObjectID');
            if (!ObjectID.isValid(id)) {
                return reject(new ValidatableError('invalid id'));
            }

            return resolve(new ObjectID(id.toString()));
        })
        .then(_id => _find({ _id }, projection, findAndUpdate));
    }

    const _findByEmail = email => _find({ email });

    const _find = (query, projection = {}, findAndUpdate) => {
        return new Promise((resolve, reject) => {
            const response = (err, subscription) => {
                if (err) {
                    return reject(new InternalServerError('An error occurred, err: ' + err));
                }

                if (findAndUpdate && !_.isNil(subscription.value)) {
                    return resolve(subscription.value);
                } else if (!findAndUpdate && !_.isNil(subscription)) {
                    return resolve(subscription);
                } else {
                    return reject(new NotFoundError());
                }

            };

            const findParams = findAndUpdate ?
                [query, projection, { returnOriginal: false } ,response] :
                [query, projection ,response];
            
            return collection[findAndUpdate ? 'findOneAndUpdate' : 'findOne'](...findParams);
        });
    }

    return Object.create({
        createSubscription,
        cancelSubscription,
        getSubscriptionById,
        getSubscriptionByEmail,
        getAllSubscriptions,
        disconnect,
    });
};

const connect = (container) => {
    return new Promise((resolve, reject) => {
        if (_.isEmpty(container) || !container.resolve('database')) {
            return reject(new InternalServerError('connection db not supplied!'));
        }

        return resolve(repository(container));
    });
};

module.exports = Object.assign({}, { connect });
