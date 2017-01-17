;(function(){
	'use strict';
	const promise = require('bluebird');
	const spex = require('spex')(promise);
	const errors = require('./modules/error')

	module.exports = function(err, req, res, next){
		if(err instanceof errors.TimestampError){
			return res.status(err.resCode).json(err); 
		} else if(err instanceof errors.DatabaseError){
			return res.status(err.resCode).json(err);
		} else if(err instanceof errors.ServerError){
			return res.status(500).json(err);
		} else if(err instanceof spex.errors.SequenceError){
			let seqError;
			if(err.error.code == 23505){
				seqError = new errors.SequenceError(
					"Árvore já existe na Base de Dados",
					{
						id_tree: res.locals.clientData.logs[err.index].id_tree,
						reason: "Rejeitada a inserção de Árvore"
					}
				);
			} else {
				seqError = new errors.SequenceError(
					err.message,
					{
						id_tree: res.locals.clientData.logs[err.index].id_tree,
						reason: err.reason
					}
				);
			}
			return res.status(seqError.resCode).json(seqError);
		}
		return res.status(500).json(new errors.ServerError("Unknown Error Ocurred", "Server::", true));
	};
})();
