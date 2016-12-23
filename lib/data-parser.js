;(function(){
	'use strict';
	const _ = require("underscore-node");
	const errors = require("./modules/error/");
	module.exports = {
		parseRequest: (req, res, next) => {
			if(!req.body.timestamp)
				return next(new errors.TimestampError("É necessário o ultimo timestamp do cliente.","ClientRequest:Timestamp"));
			let logs = _.sortBy(req.body.data, 'timestamp');
			res.locals.clientData = {
				logs: logs, 
				length: req.body.data.length,
				last_timestamp: req.body.timestamp
			};
			next();		
		},
		parseResponse: (req, res, next) => {
			res.locals.serverData = {logs: res.locals.logs};
			res.locals.serverData.size = res.locals.logs.length;
			res.locals.serverData.status = 200;
			res.locals.serverData.statusText = "OK";
			console.log(res.locals.serverData);
			res.locals.serverData.newTimestamp = res.locals.logs[res.locals.logs.length-1].insert_date;
			console.log(res.locals.serverData);
			console.log("Here!");
			next();
		}
	};
})();