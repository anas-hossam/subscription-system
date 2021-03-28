'use strict';

module.exports = (subscription, from) => {
    return {
        from,
        to: subscription.email,
        subject: 'Subscription Confirmation',
        text: `Hello ${subscription.firstName}, you are subscribed to our newsletter`,
    };
};