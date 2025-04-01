const express = require("express");
const router = express.Router();
const multer = require("multer");

const controller = require("../../controllers/admin/watch.controller");
const uploadCloud = require("../../middlewares/uploadCloud.middleware");

const upload = multer({
    storage: multer.memoryStorage(),
});

router.get("/list", controller.getList);

router.get("/detail/:id", controller.detail);

router.post(
    "/create",
    upload.fields([{ name: "images", maxCount: 10 }]),
    uploadCloud.uploadFields,
    controller.create
);

router.put(
    "/update/:id",
    upload.fields([{ name: "images", maxCount: 10 }]),
    uploadCloud.uploadFields,
    controller.update
);

router.delete("/delete/:id", controller.delete);

module.exports = router;
