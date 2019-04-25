const route = require("express").Router()
const Follow = require("../models").Follow
const User = require('../models').User
const userRoute = require('./user')

route.use('/user',userRoute)
// routes.get("/", (req, res) => {
    // User.findAll({
    //     include: ["Follower"],
    //     order:["id"]
    // })
    //     .then((datas) => {
    //         res.send(datas)
    //     })
    //     .catch((err) => {
    //         res.send(err)
    //     })
// })


//routes.use("/follow", follow)

module.exports = route