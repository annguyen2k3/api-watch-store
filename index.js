const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./config/database");

sequelize;

app.use(bodyParser.json());

const router = require("./routers/index.route");

const port = process.env.PORT || 4000;

app.use(cors());

router(app);

app.listen(port, () => {
    console.log(`Server API listening on port ${port}`);
});
