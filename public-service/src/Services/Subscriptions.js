'use strict';

const _ = require('lodash');
const axios = require('axios');

const { ConfigurationError, InternalServerError } = require('../Errors');

class Subscriptions {

    constructor(deps) {
        if (
            !_.isPlainObject(deps) ||
            !_.isPlainObject(deps.subscriptionsApi) ||
            !_.isString(deps.subscriptionsApi.url) ||
            !_.isString(deps.subscriptionsApi.tokenSecret) ||
            !_.isFunction(deps.createToken)
        ) {
            throw new ConfigurationError('missing or invalid deps');
        }

        this.createToken = deps.createToken;
        this.subscriptionsApi = deps.subscriptionsApi;
    }

    subscribe(payload) {
        if (!_.isObject(payload)) {
            throw new ConfigurationError(
                'missing or invalid payload',
            );
        }

        return this._call({
            method: 'post',
            payload,
            endpoint: 'subscribe',
        });
    }

    unsubscribe(subscriptionId) {
        if (!_.isString(subscriptionId)) {
            throw new ConfigurationError(
                'missing or invalid subscriptionId',
            );
        }

        return this._call({
            method: 'put',
            payload: { _id: subscriptionId },
            endpoint: 'unsubscribe',
        })
    }

    get(subscriptionId) {
        if (!_.isString(subscriptionId)) {
            throw new ConfigurationError(
                'missing or invalid subscriptionId',
            );
        }

        return this._call({
            method: 'get',
            payload: { _id: subscriptionId },
            endpoint: 'subscription',
        });
    }

    list() {
        return this._call({
            method: 'get',
            endpoint: 'subscriptions',
        });
    }

    _call({ payload = {}, method, endpoint }) {
        const url = `${this.subscriptionsApi.url}/${endpoint}`;
        return this.createToken(payload, this.subscriptionsApi.tokenSecret)
            .then(token => {
                const requestObj = {
                    url: _.includes(['subscription', 'unsubscribe'], endpoint) ?
                        `${url}/${payload._id}` : url,
                    method,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                };
        
                if (method === 'post') {
                    requestObj.data = payload
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

module.exports = Subscriptions;
