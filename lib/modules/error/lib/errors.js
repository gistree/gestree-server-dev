// log levels shd correspond to Log Levels listed here https://github.com/visionmedia/log.js
var AbstractError = require('./abstract-error');

var errors = function (name, logLevel, resCode) {

	var ApplicationError = function (msg, errorOn, savedData,  resCodeOverride) {
        this.name      = name;
        this.logLevel  = logLevel;
        this.resCode   = resCodeOverride || resCode || 400;
        this.errorOn   = errorOn;
        this.savedData = savedData || false;
		ApplicationError.super_.call(this, msg, this.constructor);
	};

	// util.inherits(CustomError, AstractError);
	ApplicationError.prototype = new AbstractError;
	ApplicationError.super_ = AbstractError;
	ApplicationError.prototype.constructor = ApplicationError;

	// add name info
	ApplicationError.prototype.name = name;

	return ApplicationError;
};

module.exports = errors;