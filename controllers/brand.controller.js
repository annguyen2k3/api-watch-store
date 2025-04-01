const { Op } = require("sequelize");
const Brand = require("../models/brand.model");
const Watch = require("../models/watch.model");

// [GET] /brand/list
module.exports.getList = async (req, res) => {
    try {
        const find = {};

        if (req.query.status == 0 || req.query.status == 1) {
            find.status = req.query.status;
        } else if (req.query.status) {
            find.status = -1;
        }

        const brands = await Brand.findAll({
            where: find,
            raw: true,
        });

        res.status(200).json({
            code: 200,
            message: "Get Success",
            brands,
        });
    } catch (error) {
        console.log("Error controller get list brand: ", error);
        res.status(500).json({
            code: 500,
            message: "Error internal server: " + error.message,
        });
    }
};

//[POST] /brand/create
module.exports.create = async (req, res) => {
    try {
        const brand_name = req.body.brand_name;
        const description = req.body.description;

        if (brand_name == null || brand_name == "") {
            res.status(422).json({
                code: 422,
                message: "Request brand name",
            });
            return;
        }

        const checkBrandExits = await Brand.findOne({
            where: {
                brand_name: brand_name,
            },
        });

        if (checkBrandExits) {
            res.status(422).json({
                code: 422,
                message: "Brand name is exist",
            });
            return;
        }

        const dataCreate = {
            brand_name,
            description,
        };

        const brand = await Brand.create(dataCreate);

        res.status(201).json({
            code: 201,
            message: "Create Success",
            data: {
                ...brand.dataValues,
            },
        });
    } catch (error) {
        console.log("Error controller create brand: ", error);
        res.status(500).json({
            code: 500,
            message: "Error internal server: " + error.message,
        });
    }
};

//[PUT] /brand/update/:id
module.exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const brand_name = req.body.brand_name;
        const description = req.body.description;
        const status = req.body.status;

        // Check brand not exits
        const brand = await Brand.findOne({
            where: {
                id: id,
            },
            raw: true,
        });

        if (!brand) {
            res.status(422).json({
                code: 422,
                message: "Id brand not exist",
            });
            return;
        }
        // End Check brand not exits

        // Check brand name
        if (brand_name == null || brand_name == "") {
            res.status(422).json({
                code: 422,
                message: "Request brand name",
            });
            return;
        }

        const checkBrandExits = await Brand.findOne({
            where: {
                id: {
                    [Op.ne]: id,
                },
                brand_name: brand_name,
            },
        });

        if (checkBrandExits) {
            res.status(422).json({
                code: 422,
                message: "Brand name is exist",
            });
            return;
        }
        // End Check Brand Name

        // Check Status
        if (status !== 0 && status !== 1) {
            res.status(422).json({
                code: 422,
                message: "Status invalid",
            });
            return;
        }
        // End Check Status
        const dataUpdate = {
            id,
            brand_name,
            description,
            status,
        };

        await Brand.update(dataUpdate, {
            where: {
                id: id,
            },
        });

        res.status(200).json({
            code: 200,
            message: "Update Success",
        });
    } catch (error) {
        console.log("Error controller update brand: ", error);
        res.status(500).json({
            code: 500,
            message: "Error internal server: " + error.message,
        });
    }
};
