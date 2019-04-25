const routes = require("express").Router()
const follow = require("./follow")
const user = require("./user")
const User = require('../models').User
let bcrypt = require('bcryptjs')
const sessionChecker = require('../helpers/session')

routes.get("/", (req, res) => {
    res.render("homePage", {
        wrongInput: '',
        success: '',
        successCreate: '',
        wrongLength: ''
    })
})

routes.use("/follow", sessionChecker, follow)
routes.use("/user", sessionChecker, user)

routes.post('/', (req, res) => {
    let input = {
        username: req.body.username,
        password: req.body.password
    }
    User.findOne({
        where: {
            username: input.username
        }
    })
        .then((userData) => {
            req.session.user = userData.getFullname()
            req.session.userId = userData.dataValues.id

            if (userData !== null) {
                let check = bcrypt.compareSync(input.password, userData.password)
                if (check == true) {
                    res.redirect(`/user/${req.session.userId}`)
                } else {
                    res.render('homePage', {
                        wrongInput: 'Wrong username or password, please try again',
                        success: '',
                        successCreate: '',
                        wrongLength: ''
                    })
                }
            } else {
                res.render('homePage', {
                    wrongInput: 'Wrong username or password, please try again',
                    success: '',
                    successCreate: '',
                    wrongLength: ''
                })
            }
        })
        .catch(err => res.send(err))
})

routes.post('/register', (req, res) => {
    let input = {
        username: req.body.username,
        password: req.body.password,
        first_name: req.body.first_name,
        last_name: req.body.last_name
    }
    User.create(input)
        .then((success) => {
            res.render('homePage', {
                success: success.getFullname(),
                successCreate: 'is successfully created',
                wrongInput: '',
                wrongLength: ''
            })
        })
        .catch(err => res.render('homePage', {
            wrongLength: err.errors[0].message,
            wrongInput: '',
            successCreate: '',
            success: ''
        }))
})

routes.get('/logout', function (req, res) {
    req.session.user = null
    res.redirect('/')
})

module.exports = routes