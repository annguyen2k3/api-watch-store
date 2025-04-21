const brandRoutes = require("./brand.route");
const watchRoutes = require("./watch.route");
const authRoutes = require("./auth.route");

module.exports = (app) => {
    app.get("/", (req, res) => {
        res.send("API Server Watch Store: Admin");
    });

    app.use("/brand", brandRoutes);

    app.use("/watch", watchRoutes);

    app.use("/auth", authRoutes);
};
