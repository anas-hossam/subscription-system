'use strict';

const { serverSettings, mailSettings } = require('./config')[process.env.NODE_ENV];
const { initDI } = require('./di');
const models = require('../models');

const init = initDI.bind(null, { serverSettings, mailSettings, models });

module.exports = Object.assign({}, { init });
