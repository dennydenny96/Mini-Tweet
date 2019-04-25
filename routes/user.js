const routes = require('express').Router()
const User = require('../models').User

routes.get('/', (req, res) => {
    res.render('homeUser', {
        userFullname: req.session.user,
    })
})

module.exports = routes