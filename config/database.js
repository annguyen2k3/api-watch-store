const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD,
    {
        host: process.env.DATABASE_HOST,
        dialect: "mysql",
        dialectModule: require("mysql2"),
    }
);

// Kiểm tra kết nối DB
sequelize
    .authenticate()
    .then(() => {
        console.log("Connect Success!");
    })
    .catch((error) => {
        console.error("Connect Error: " + error);
    });

module.exports = sequelize;
