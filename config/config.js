require('dotenv').config();

module.exports = {
  development: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    accessKey: process.env.ACCESS_KEY,
    secretAccessKey:process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
    bucket: process.env.BUCKET,
  }
};
