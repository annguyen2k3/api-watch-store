const { Op } = require("sequelize");
const Watch = require("../models/watch.model");
const Brand = require("../models/brand.model");
const Image = require("../models/image.model");

const { deleteImgCloud } = require("../helpers/deleteImgCloud.helper");

//  [GET] /watch/list
module.exports.getList = async (req, res) => {
    try {
        const find = {};

        if (req.query.status == 0 || req.query.status == 1) {
            find.status = req.query.status;
        } else if (req.query.status) {
            find.status = -1;
        }

        const watches = await Watch.findAll({
            where: find,
            raw: true,
        });

        await Promise.all(
            watches.map(async (item) => {
                const brand = await Brand.findOne({
                    where: {
                        id: item.brand_id,
                    },
                    raw: true,
                });
                if (brand) {
                    item.brand_name = brand.brand_name;
                }

                const images = await Image.findAll({
                    where: {
                        watches_id: item.id,
                    },
                    raw: true,
                });

                item.images = [];

                if (images.length > 0) {
                    images.forEach((img) => {
                        item.images.push(img.path_image);
                    });
                }
            })
        );

        res.status(200).json({
            code: 200,
            message: "Get Success",
            watches,
        });
    } catch (error) {
        console.log("Error controller get list watch: ", error);
        res.status(500).json({
            code: 500,
            message: "Error internal server: " + error.message,
        });
    }
};

// [GET] /watch/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const product = await Watch.findOne({
            where: {
                id: req.params.id,
            },
            raw: true,
        });

        if (!product) {
            res.status(422).json({
                code: 422,
                message: "Product ID not exist",
            });
            return;
        }

        const brand = await Brand.findOne({
            where: {
                id: product.brand_id,
            },
            raw: true,
        });

        product.brand_name = brand.brand_name;

        const images = await Image.findAll({
            where: {
                watches_id: product.id,
            },
            raw: true,
        });

        product.images = [];

        if (images.length > 0) {
            images.forEach((img) => {
                product.images.push(img.path_image);
            });
        }

        res.status(200).json({
            code: 200,
            message: "Get Success",
            product,
        });
    } catch (error) {
        console.log("Error controller detail product: ", error);
        res.status(500).json({
            code: 500,
            message: "Error internal server: " + error.message,
        });
    }
};

//  [POST] /watch/create
module.exports.create = async (req, res) => {
    try {
        const product_name = req.body.product_name;
        const description = req.body.description;
        const brand_id = req.body.brand_id;
        const price = req.body.price;
        const discount = req.body.discount;
        const quantity = req.body.quantity;
        const images = req.body.images;

        // Check Product Name
        if (!product_name) {
            res.status(422).json({
                code: 422,
                message: "Product name invalid",
            });
            return;
        }

        const checkNameExist = await Watch.findOne({
            where: {
                product_name: product_name,
            },
        });
        if (checkNameExist) {
            res.status(422).json({
                code: 422,
                message: "Product name is exist",
            });
            return;
        }
        // End Check Product Name

        // Check Brand Id
        const checkBrandId = await Brand.findOne({
            where: {
                id: brand_id,
            },
        });
        if (!checkBrandId) {
            res.status(422).json({
                code: 422,
                message: "Brand ID Invalid",
            });
            return;
        }
        // End Check Brand Id

        if (price < 0 || discount < 0 || quantity < 0) {
            res.status(422).json({
                code: 422,
                message: "Data Invalid",
            });
            return;
        }

        const product = await Watch.create({
            product_name,
            description,
            brand_id,
            price,
            discount,
            quantity,
        });

        // Gán URL ảnh mới
        if (images && images.length > 0) {
            images.forEach(async (image) => {
                await Image.create({
                    watches_id: product.id,
                    path_image: image,
                });
            });
        }

        res.status(201).json({
            code: 201,
            message: "Create Success",
            data: {
                ...product.dataValues,
                images,
            },
        });
    } catch (error) {
        console.log("Error controller create watch: ", error);
        res.status(500).json({
            code: 500,
            message: "Error internal server: " + error.message,
        });
    }
};

//  [PUT] /watch/update
module.exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const product_name = req.body.product_name;
        const description = req.body.description;
        const brand_id = req.body.brand_id;
        const price = req.body.price;
        const discount = req.body.discount;
        const status = req.body.status;
        const quantity = req.body.quantity;
        const images = req.body.images;

        // Check ID
        const watch = await Watch.findOne({
            where: {
                id: id,
            },
        });
        if (!watch) {
            res.status(422).json({
                code: 422,
                message: "ID Product not exist",
            });
            return;
        }
        // End Check ID

        // Check Product Name
        if (!product_name) {
            res.status(422).json({
                code: 422,
                message: "Product name invalid",
            });
            return;
        }

        const checkNameExist = await Watch.findOne({
            where: {
                id: {
                    [Op.ne]: id,
                },
                product_name: product_name,
            },
        });
        if (checkNameExist) {
            res.status(422).json({
                code: 422,
                message: "Product name is exist",
            });
            return;
        }
        // End Check Product Name

        // Check Brand Id
        const checkBrandId = await Brand.findOne({
            where: {
                id: brand_id,
            },
        });
        if (!checkBrandId) {
            res.status(422).json({
                code: 422,
                message: "Brand ID Invalid",
            });
            return;
        }
        // End Check Brand Id

        // Check Status
        if (status != 0 && status != 1) {
            res.status(422).json({
                code: 422,
                message: "Status invalid",
            });
            return;
        }
        // End Check Status

        if (price < 0 || discount < 0 || discount > 1 || quantity < 0) {
            res.status(422).json({
                code: 422,
                message: "Data Invalid",
            });
            return;
        }

        await Watch.update(
            {
                product_name,
                description,
                brand_id,
                price,
                status,
                discount,
                quantity,
            },
            {
                where: {
                    id: id,
                },
            }
        );

        // Xoá ảnh cũ
        const imagesDel = await Image.findAll({
            where: { watches_id: id },
        });

        if (imagesDel && imagesDel.length > 0) {
            const imageUrls = imagesDel.map((img) => img.path_image);

            await deleteImgCloud(imageUrls);

            await Image.destroy({
                where: { watches_id: id },
            });
        }

        // Gán URL ảnh mới
        if (images && images.length > 0) {
            images.forEach(async (image) => {
                await Image.create({
                    watches_id: id,
                    path_image: image,
                });
            });
        }

        res.status(200).json({
            code: 200,
            message: "Update Success",
        });
    } catch (error) {
        console.log("Error controller create brand: ", error);
        res.status(500).json({
            code: 500,
            message: "Error internal server: " + error.message,
        });
    }
};

//  [DELETE] /watch/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;

        // Xoá ảnh cũ
        const imagesDel = await Image.findAll({
            where: { watches_id: id },
        });

        if (imagesDel && imagesDel.length > 0) {
            const imageUrls = imagesDel.map((img) => img.path_image);

            await deleteImgCloud(imageUrls);

            await Image.destroy({
                where: { watches_id: id },
            });
        }

        await Watch.destroy({
            where: {
                id: id,
            },
        });

        res.status(200).json({
            code: 200,
            message: "Delete Success",
        });
    } catch (error) {
        console.log("Error controller delete watch: ", error);
        res.status(500).json({
            code: 500,
            message: "Error internal server: " + error.message,
        });
    }
};
