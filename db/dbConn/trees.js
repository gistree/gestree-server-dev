;(function(){
	'use strict';
	const db = require('../').db;
	const error = require('../../lib/modules/error');
	module.exports = {
		syncServer: (req, res, next) => {
			let clientData = res.locals.clientData;
			if(!clientData.length)
				return next();
			db.trees.syncServer(clientData.logs, next)
				.then(data => next())
				.catch(err => next(err));
		},
		syncClient: (req, res, next) => {
			let clientData = res.locals.clientData;
			db.trees.syncClient({last_timestamp:clientData.last_timestamp})
				.then(data => {
					res.locals.logs = data;
					return next();
				})
				.catch(err => {
					next(new error.DatabaseError("Erro no acesso à BD.", "Server::syncClient", true, 500));
				});
		}
	};
})();
