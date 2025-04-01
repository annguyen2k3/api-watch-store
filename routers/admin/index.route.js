const brandRoutes = require("./brand.route");
const watchRoutes = require("./watch.route");

module.exports = (app) => {
    const prefixAdmin = "/admin";

    app.get("/admin", (req, res) => {
        res.send("API Server Watch Store: Admin");
    });

    app.use(prefixAdmin + "/brand", brandRoutes);

    app.use(prefixAdmin + "/watch", watchRoutes);
};
