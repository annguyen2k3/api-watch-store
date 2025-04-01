module.exports = (app) => {
    app.get("/", (req, res) => {
        res.send("API Server Watch Store: Client");
    });
};
