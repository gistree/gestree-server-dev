;(function(){
	'use strict';
	const express = require('express');
	const router = express.Router();
	const db_trees = require('../db/dbConn/trees');
	const dataParser = require('../lib/data-parser'); 

	router.post('/api/sync',
		dataParser.parseRequest,
		db_trees.syncServer,
		db_trees.syncClient, 
		dataParser.parseResponse,
		(req, res) => {
			console.log("Cheguei");
			res.status(200).json(res.locals.serverData);
		}
	);
	router.get('/api/echo/:echo_message', (req, res) => {
		let message = "(SyncDB)" + " - " + req.params.echo_message;
		res.status(200).send(message);
	});
	router.post('/api/post_test', (req ,res) => {
		console.log("Received Message From Post!");
		console.log(req.body);
		res.status(200).send("Received Post!");
	});
	module.exports = router;
})();