const brandRoutes = require("./brand.route");
const watchRoutes = require("./watch.route");

module.exports = (app) => {
    app.get("/", (req, res) => {
        res.send("API Server Watch Store: Admin");
    });

    app.use("/brand", brandRoutes);

    app.use("/watch", watchRoutes);
};
