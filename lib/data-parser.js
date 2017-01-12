;(function(){
	'use strict';
	const _ = require("underscore-node");
	const errors = require("./modules/error/");
	module.exports = {
		parseRequest: (req, res, next) => {
			console.log(req.body);
			if(!req.body.timestamp)
				return next(new errors.TimestampError("É necessário o ultimo timestamp do cliente.","ClientRequest:Timestamp"));
			console.log("DATA!!");
			console.log(req.body.data);
			let logs = _.sortBy(req.body.data, 'timestamp');
			res.locals.clientData = {
				logs: logs, 
				length: req.body.data.length,
				last_timestamp: req.body.timestamp
			};
			console.log("Client Data!");
			console.log(res.locals.clientData);
			next();		
		},
		parseResponse: (req, res, next) => {
			let serverData = {logs: res.locals.logs};
			serverData.size = res.locals.logs.length;
			serverData.status = 200;
			serverData.statusText = "OK";
			console.log("Testing size");
			console.log(serverData.size);
			if(serverData.size > 0){
				console.log("In Here!");
				serverData.newTimestamp = res.locals.logs[res.locals.logs.length-1].insert_date;
			}else{
				console.log("NoT");
				serverData.newTimestamp = req.locals.clientData.last_timestamp;
			}
			res.locals.serverData = serverData;
			next();
		}
	};
})();
