const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./config/database");

sequelize;

app.use(bodyParser.json());

const routeClient = require("./routers/client/index.route");
const routeAdmin = require("./routers/admin/index.route");

const port = process.env.PORT || 4000;

app.use(cors());

routeClient(app);
routeAdmin(app);

app.listen(port, () => {
    console.log(`Server API listening on port ${port}`);
});
