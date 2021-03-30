'use strict';

const serverSettings = {
    port: process.env.PORT || 3100,
    tokenSecret: process.env.TOKEN_SECRET || 'this is token signature secret',
};

const subscriptionsApi = {
    url: process.env.SUBSCRIPTION_API_URL || 'http://localhost:3200',
    tokenSecret: process.env.SUBSCRIPTION_TOKEN_SECRET || 'this is token signature secret',
};

module.exports = Object.assign({}, {
    [process.env.NODE_ENV]: Object.assign({}, { serverSettings, subscriptionsApi }),
});