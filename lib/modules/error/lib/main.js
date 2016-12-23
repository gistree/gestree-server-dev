const Errors = require('./errors');
module.exports = {
	TimestampError: Errors('Timestamp', 'error', 422),
	SequenceError: Errors('Sequence', 'error', 422), 
	DatabaseError: Errors('Database', 'error', 500), 
	ServerError: Errors('Server', 'error', 500),	
	Errors: Errors
};