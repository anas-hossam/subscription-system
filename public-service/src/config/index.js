'use strict';

const { serverSettings, subscriptionsApi } = require('./config')[process.env.NODE_ENV];
const { initDI } = require('./di');
const models = require('../models');

const init = initDI.bind(null, { serverSettings, subscriptionsApi, models });

module.exports = Object.assign({}, { init });
