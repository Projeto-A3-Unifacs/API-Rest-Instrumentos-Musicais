const { Pool } = require('pg');
require('dotenv').config();

console.log('DATABASE_URL:', process.env.DATABASE_URL);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
    console.log('Conectado ao PostgreSQL (Neon)');
});

pool.on('error', (err) => {
    console.error('Erro inesperado no PostgreSQL:', err);
});

module.exports = pool;