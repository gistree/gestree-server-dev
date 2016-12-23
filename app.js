;(function() {
	'use strict';

	const express = require('express');
	const path = require('path');
	const logger = require('morgan');
	const bodyParser = require('body-parser');

	const api = require('./routes/api');
	const errorHandler = require('./lib/error-handler');

	let app = express();

	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));

	app.use('/', api);
	app.use(errorHandler);

	module.exports = app;
})();