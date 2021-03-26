'use strict';

const { InternalServerError } = require('../Errors');

const repository = (container) => {
    const { database: db } = container.cradle;
    const collection = db.collection('subscriptions');

    const createSubscription = (subscription) => {
        return new Promise((resolve, reject) => {
            collection.insertOne(subscription, (err, { ops: [result] }) => {
                if (err) {
                    reject(new InternalServerError('An error occuered creating a subscription, err:' + err));
                }

                resolve({ subscription_id: result._id });
            });
        });
    };

    const cancelSubscription = (subscriptionId) => {
        return new Promise((resolve, reject) => {
            const ObjectID = container.resolve('ObjectID');
            const query = { _id: new ObjectID(subscriptionId) };

            const response = (err, subscription) => {
                if (err) {
                    reject(new InternalServerError('An error occuered canceling a subscription, err: ' + err));
                }

                resolve(subscription);
            };

            collection.findOneAndUpdate(query, { $set: { is_active: false } }, response);
        })
    };

    const getSubscriptionById = (subscriptionId) => {
        return new Promise((resolve, reject) => {
            const ObjectID = container.resolve('ObjectID');
            const query = { _id: new ObjectID(subscriptionId) };

            const response = (err, subscription) => {
                if (err) {
                    reject(new InternalServerError('An error occuered retrieving a subscription, err: ' + err));
                }

                resolve(subscription);
            };

            collection.findOne(query, {}, response);
        })
    };

    const getAllSubscriptions = () => {
        return new Promise((resolve, reject) => {
            const subscriptions = [];
            const cursor = collection.find({});
            const addSubscription = (subscription) => {
                subscriptions.push(subscription)
            };

            const sendSubscriptions = (err) => {
                if (err) {
                    reject(new InternalServerError('An error occured fetching all subscriptions, err:' + err));
                }

                resolve(subscriptions.slice());
            };

            cursor.forEach(addSubscription, sendSubscriptions);
        });
    };

    const disconnect = () => {
        db.close()
    };

    return Object.create({
        createSubscription,
        cancelSubscription,
        getSubscriptionById,
        getAllSubscriptions,
        disconnect
    });
};

const connect = (container) => {
    return new Promise((resolve, reject) => {
        if (!container.resolve('database')) {
            reject(new InternalServerError('connection db not supplied!'))
        }

        resolve(repository(container));
    });
};

module.exports = Object.assign({}, { connect });
