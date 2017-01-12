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
			let serverData = {logs: res.locals.logs};
			serverData.size = res.locals.logs.length;
			serverData.status = 200;
			serverData.statusText = "OK";
			if(serverData.size > 0){
				serverData.newTimestamp = res.locals.logs[res.locals.logs.length-1].insert_date;
			}else{
				serverData.newTimestamp = res.locals.clientData.last_timestamp;
			}
			res.locals.serverData = serverData;
			next();
		}
	};
})();
