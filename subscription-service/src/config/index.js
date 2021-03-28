'use strict';

const { dbSettings, serverSettings, mailApi } = require('./config')[process.env.NODE_ENV];
const database = require('./db');
const { initDI } = require('./di');
const models = require('../models');

const init = initDI.bind(null, { serverSettings, mailApi, dbSettings, database, models });

module.exports = Object.assign({}, { init });
