'use strict';

const _ = require('lodash');
const axios = require('axios');

const { ConfigurationError, InternalServerError } = require('../Errors');

class Mail {

    constructor(deps) {
        if (
            !_.isPlainObject(deps) ||
            !_.isPlainObject(deps.mailApi) ||
            !_.isString(deps.mailApi.url) ||
            !_.isString(deps.mailApi.tokenSecret) ||
            !_.isFunction(deps.createToken)
        ) {
            throw new ConfigurationError('missing or invalid deps');
        }

        this.createToken = deps.createToken;
        this.mailApi = deps.mailApi;
    }

    send(payload) {
        if (!_.isObject(payload)) {
            throw new ConfigurationError(
                'missing or invalid payload',
            );
        }

        return this._call({
            method: 'post',
            payload,
            endpoint: 'sendMail',
        });
    }

    _call({ payload = {}, method, endpoint }) {
        const url = `${this.mailApi.url}/${endpoint}`;
        return this.createToken(payload, this.mailApi.tokenSecret)
            .then(token => {
                const requestObj = {
                    url,
                    method,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                };
        
                if (method === 'post') {
                    requestObj.data = { subscription: payload };
                }
        
                return axios(requestObj);
            })
            .then(response => response.data)
            .catch(err => {
                if (err) {
                    throw new InternalServerError(err);
                }
            });
    }

}

module.exports = Mail;
