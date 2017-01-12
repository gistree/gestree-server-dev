'use strict';
let fRot = require('file-stream-rotator'); 
let accessLogStream = fRot.getStream({filename:__dirname + "/access-%DATE%.log", frequency:"daily", verbose: false, date_format: "YYYY-MM-DD"});
let errorLogStream = fRot.getStream({filename:__dirname + "/error-%DATE%.log", frequency:"daily", verbose: false, date_format: "YYYY-MM-DD"});
module.exports = function(app){
	app.use(require('morgan')('[:date][:remote-addr] - :method :url - (:status) :response-time', {stream: accessLogStream}));
	app.use(require('morgan')('[:date][:remote-addr] - :method :url - (:status) :response-time', {stream: errorLogStream, skip:(req, res) => {return res.statusCode < 400}}));
}