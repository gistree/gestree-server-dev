var dbConfig = module.exports = process.env.DBCONN || {
	host: 'localhost',
	port: 5432,
	database: 'sync_db',
	user: 'postgres',
	password: 'postgres',
};