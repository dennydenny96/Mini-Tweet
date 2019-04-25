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
        successCreate: ''
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
            if (userData !== null) {
                let check = bcrypt.compareSync(input.password, userData.password)
                if (check == true) {
                    req.session.user = userData.getFullname()
                    res.redirect('/user')
                } else {
                    res.render('homePage', {
                        wrongInput: 'Wrong username or password, please try again',
                        success: '',
                        successCreate: ''
                    })
                }
            } else {
                res.render('homePage', {
                    wrongInput: 'Wrong username or password, please try again',
                    success: '',
                    successCreate: ''
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
                wrongInput: ''
            })
        })
        .catch(err => res.send(err))
})

routes.get('/logout', function (req, res) {
    req.session.user = null
    res.redirect('/')
})

module.exports = routes