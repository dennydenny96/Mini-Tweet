const routes = require("express").Router()
const follow = require("./follow")

routes.get("/", (req, res) => {
    res.render("index")
})
routes.use("/follow", follow)

module.exports = routes