const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        user_name: {
            type: DataTypes.STRING(191),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(191),
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING(191),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(191),
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING(32),
            allowNull: false,
        },
        email_verified_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: "users",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

module.exports = User;
