// eslint-disable-next-line
const dotenv = require('dotenv');
dotenv.config();

const config = {
  dialect: 'postgres',
  url: process.env.DATABASE_URL,
};

module.exports = config;
