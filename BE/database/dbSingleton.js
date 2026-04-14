const mysql = require('mysql2');

let connection;

const dbSingleton = {
  getConnection: () => {
    if (!connection) {
      connection = mysql.createConnection({
        host:     process.env.DB_HOST     || 'localhost',
        port:     process.env.DB_PORT     || 3306,
        user:     process.env.DB_USER     || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME     || 'gamedatabase',
      });

      connection.connect(err => {
        if (err) {
          console.error('Error connecting to database:', err);
          throw err;
        }
        console.log('Connected to MySQL!');
      });
    }
    return connection;
  },
};

module.exports = dbSingleton;
