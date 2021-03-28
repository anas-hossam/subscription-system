'use strict';

const _ = require('lodash');
const JWS = require('jws');

// token type default
const DEFAULT_TOKEN_TYPE = 'JWT';
// DAYS * HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND
const DEFAULT_EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000;
// HMAC (Message Authentication Code) using SHA-512 hash algorithm
const DEFAULT_MAC_ALGORITHM = 'HS512';

module.exports = (tokenPayload, tokenSecret, tokenExpiration) => {
    tokenExpiration = tokenExpiration || DEFAULT_EXPIRATION_TIME;

    const payload = _.cloneDeep(tokenPayload);
    const now = _.now();
    _.merge(payload, { iat: now, exp: now + tokenExpiration });
    
    const options = {
        header: { 
            type: DEFAULT_TOKEN_TYPE,
            alg: DEFAULT_MAC_ALGORITHM,
        },
        payload,
        secret: tokenSecret,
    };

    return Promise.resolve(JWS.sign(options));
};
