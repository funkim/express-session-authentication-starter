const { Pool } = require('pg');

require('dotenv').config();

const pool = new Pool({
  connectionString: 'postgresql://postgres:password@localhost:5432/testing2',
});

module.exports = pool;
