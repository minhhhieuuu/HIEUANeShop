//import { createPool } from 'mysql2/promise';
const {createPool} = require('mysql2/promise');

const db = createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    database: process.env.DB_NAME || 'onlineshop',
    password: process.env.DB_PASSWORD || 'Hieu@14402',
    port: process.env.DB_PORT || 3306
})

module.exports = db;