const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Image = sequelize.define(
    "Image",
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        watches_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        path_image: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "images",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

module.exports = Image;
