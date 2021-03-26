'use strict';

const { dbSettings, serverSettings } = require('./config')[process.env.NODE_ENV];
const database = require('./db');
const { initDI } = require('./di');
const models = require('../models');
const middlewares = require('../middlewares');

const init = initDI.bind(null, { serverSettings, dbSettings, database, models, middlewares });

module.exports = Object.assign({}, { init });
