const Sequelize = require('sequelize');

// const db = new Sequelize(process.env.DATABASE_URL, {logging: false});

// For cloud9 db
const db = new Sequelize('ubuntu', 'postgres', 'password', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});