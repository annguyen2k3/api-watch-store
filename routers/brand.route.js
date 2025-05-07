const express = require("express");
const router = express.Router();

const controller = require("../controllers/brand.controller");

router.get("/list", controller.getList);

router.post("/create", controller.create);

router.put("/update/:id", controller.update);

router.delete("/delete/:id", controller.deleteBrand);

module.exports = router;
