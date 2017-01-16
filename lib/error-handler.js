;(function(){
	'use strict';
	const promise = require('bluebird');
	const spex = require('spex')(promise);
	const errors = require('./modules/error')

	module.exports = function(err, req, res, next){
		if(err instanceof errors.TimestampError){
			console.log("Error::TimestampError");
			console.log(err.message);
			return res.status(err.resCode).json(err.message); 
		};
		if(err instanceof errors.DatabaseError){
			console.log("Error::DatabaseError");
			console.log(err);
			return res.status(err.resCode).json(err);
		}
		if(err instanceof errors.ServerError){
			console.log("Error::ServerError");
			console.log(err);
			return res.status(500).json(err);
		}
		if(err instanceof spex.errors.SequenceError){
			console.log("Error::SequenceError");
			let seqError = new errors.SequenceError(err.message, {
				id_tree:res.locals.clientData.logs[err.index].id_tree,
				reason: err.reason
			});
			console.log(seqError);
			return res.status(seqError.resCode).json(seqError);
		}
		console.log("Error::Unknown");
		console.log(err);
		return res.status(500).json(new errors.ServerError("Unknown Error Ocurred", "Server::", true));
	};
})();
