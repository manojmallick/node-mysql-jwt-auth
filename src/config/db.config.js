const mysql = require('mysql');// database 
const { logger } = require('../utils/logger');
const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = require('../utils/secrets');

const connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME
});// connection 

connection.connect((err) => {
    if (err) logger.error(err.message); // error
    else logger.info('Database connected') // ok
});

module.exports = connection;