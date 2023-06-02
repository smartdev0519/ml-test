/**
 * @file Defines a connection to the PostgreSQL database, using environment
 * variables for connection information.
 */
import { createPool } from 'slonik';
import dotenv from "dotenv"
dotenv.config();

const {
	DB_PORT = '',
	DB_HOST = '',
	DB_USER = '',
	DB_PASSWORD = '',
	DB_NAME = '',
	// STAGE = '',
} = process.env;

const connString = `postgres://${DB_USER}:${encodeURIComponent(DB_PASSWORD)}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

// if (STAGE === 'prod') {
// 	connString += '?ssl=1';
// }

const globalDb = createPool(connString);

export default globalDb;