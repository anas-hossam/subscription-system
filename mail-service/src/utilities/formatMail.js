'use strict';

module.exports = (subscription, from) => {
    return Promise.resolve({
        from,
        to: subscription.email,
        subject: 'Subscription Confirmation',
        text: `Hello ${subscription.first_name}, you are subscribed to our newsletter`,
    });
};