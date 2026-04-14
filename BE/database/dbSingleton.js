const mysql = require('mysql2');

let connection; // Variable for storing a single connection

const isSslEnabled = process.env.DB_SSL === 'true';

const dbSingleton = {
/**
 * Establishes and returns a singleton MySQL database connection.
 * If the connection does not exist, it creates a new one using the specified
 * host, user, password, and database. If a connection already exists, it returns
 * the existing connection. Throws an error if unable to connect.
 *
 * @returns {object} The MySQL database connection.
 */
    getConnection: () => {
        if (!connection) {
            const connectionConfig = {
                host: process.env.DB_HOST || 'localhost',
                port: Number(process.env.DB_PORT) || 3306,
                user: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_NAME || 'gamedatabase',
            };

            if (isSslEnabled) {
                connectionConfig.ssl = {
                    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
                };
            }

            // Create a connection only once
            connection = mysql.createConnection(connectionConfig);

            connection.connect((err) => {
                if (err) {
                    console.error('Error connecting to database:', err);
                    throw err;
                }
                console.log('Connected to MySQL!');
            });
        }
        return connection;
    }
};

module.exports = dbSingleton;