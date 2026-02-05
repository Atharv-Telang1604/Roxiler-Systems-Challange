const { Pool } = require("pg");

const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false, 
  },
});


db.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error(' Database connection error:', err.message);
    console.error('Please check your .env file and ensure database tables are created.');
  } else {
    console.log('Database connected successfully');
  }
});

module.exports = db;
