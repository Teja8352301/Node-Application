const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)

var options = {
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '12345678',
	database: 'shop'
};

let sessionStore = new MySQLStore(options)

module.exports = sessionStore