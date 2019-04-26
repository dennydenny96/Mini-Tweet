const routes = require('express').Router()
const User = require('../models').User
const Op = require('sequelize').Op
const Tweet = require("../models").Tweet
const Follow = require("../models").Follow
const checkSenti = require('../helpers/checksentiment')
const Sentiment = require('sentiment')
const sentiment = new Sentiment()

routes.get('/:id', (req, res) => {
    let data = []
    Follow.findAll({
        where: {
            FollowerId: req.params.id
        }
    })
        .then(followings => {
            followings.forEach(value => {
                let obj = {
                    UserId: value.FollowingId
                }
                data.push(obj)
            })
            return Tweet.findAll({
                where: {
                    [Op.or]: data
                }
            })
        })
        .then(data => {
            let userId = req.params.id
            User.findOne({
                where: {
                    id: userId
                },
                include: [Tweet]
            })
                .then((user) => {
                    data.forEach(tweet => {
                        user.Tweets.push(tweet)
                    })
                    user.Tweets.forEach(post => {
                        let result = sentiment.analyze(post.tweet)
                        post.dataValues.sentiment = result.comparative
                    })
                    User.findAll()
                        .then(data => {
                            return data
                        })
                        .then(dataAsd => {
                            res.render('homeUser', {
                                name: user.getFullname(),
                                followLink: userId,
                                dataTweets: user.Tweets,
                                sentiment: checkSenti,
                                profileName: dataAsd
                            })
                        })
                        .catch(err => res.send(err))
                })
                .catch(err => res.send(err))
        })
        .catch(err => res.send(err))
})

routes.post('/:id', (req, res) => {
    let userId = req.params.id
    let tweetText = {
        tweet: req.body.tweet,
        UserId: userId
    }
    Tweet.create(tweetText)
        .then(() => {
            res.redirect(`/user/${userId}`)
        })
        .catch((err) => {
            res.send(err)
        })
})

routes.get('/:id/follower', (req, res) => {
    User.findOne({
        include: ['Follower'],
        where: {
            id: req.params.id
        },
        order: ["id"]
    })
        .then((data) => {
            res.render('follower', {
                followerData: data.Follower,
                followLink: req.params.id
            })
        })
        .catch((err) => {
            res.send(err)
        })
})

routes.get('/:id/following', (req, res) => {
    User.findOne({
        include: ['Following'],
        where: {
            id: req.params.id
        },
        order: ['id'],
    })
        .then((data) => {
            res.render('following', {
                followingData: data.Following,
                followLink: req.params.id
            })
        })
        .catch((err) => res.send(err))
})

routes.get('/:id/search', (req, res) => {
    let search = req.query.search
    User.findOne({
        where: {
            username: search
        }
    })
        .then((data) => {
            if (!data) {
                res.send('Username doesnt exist')
            } else {
                res.render('search', {
                    searchUser: data,
                    originUser: req.params.id,
                    followLink: req.params.id,
                    msg: ''
                })
            }
        })
        .catch((err) => {
            res.send(err)
        })
})

routes.get('/:followerId/follow/:followingId', (req, res) => {
    let data = {
        FollowerId: req.params.followerId,
        FollowingId: req.params.followingId
    }

    Follow.create(data)
        .then(() => {
            User.findByPk(req.params.followingId)
                .then((data) => {
                    res.render('search', {
                        searchUser: data,
                        originUser: req.params.id,
                        followLink: req.params.id,
                        msg: `Yeay you have followed ${data.getFullname()}`
                    })
                })
                .catch((err) => {
                    res.send(err)
                })
        })
        .catch((err) => {
            res.send(err)
        })
})

module.exports = routes