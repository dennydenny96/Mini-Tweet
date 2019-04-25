const route = require('express').Router()
const Op = require('sequelize').Op
const User= require('../models').User
const Tweet = require('../models').Tweet
const Follow = require('../models').Follow
const findname = require('../helpers/findname')
const Sentiment = require('sentiment')

route.get('/:id', (req, res) => {
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
            // include: [User],
            where: {
                [Op.or]: data
            }
        })
    })
    .then(data => {
        let userId = req.params.id
        User.findOne({
            include:[Tweet],
            where:{
                id:userId
            }
        })
        .then((user) => {
            data.forEach(tweet => {
                user.Tweets.push(tweet)
            })
            user.Tweets.forEach(post => {
                post.dataValues.sentiment = 0
            })
            res.send(user.Tweets)
            res.render('homeUser.ejs',{
                name:user.username,
                followLink:userId,
                dataTweets:user.Tweets,
            })
        })
        .catch((err) => {
            res.send(err)
        })
    })
    .catch(err => res.send(err))
})

// route.get('/:id',(req,res) =>{
//     let userId = req.params.id
//     User.findOne({
//         include:[Tweet],
//         where:{
//             id:userId
//         }
//     })
//     .then((user) => {
//         // res.render('homeUser.ejs',{
//         //     name:user.username,
//         //     followLink:userId,
//         //     dataTweets:user.Tweets
//         // })
//     })
//     .catch((err)=> {
//         res.send(err)
//     })
// })

route.post('/:id',(req,res) =>{
    let userId = req.params.id
    let tweet = {
        tweet:req.body.tweet,
        UserId:userId
    }
    Tweet.create(tweet)
        .then(() => {
            res.redirect(`/user/${userId}`)
        })
        .catch((err) => {
            res.send(err)
        })
})

route.get('/:id/follower',(req,res) => {
    User.findOne({
        include: ["Follower"],
        where:{
            id:req.params.id
        },
        order:["id"],
    })
    .then((data) => {
        res.render('follower.ejs',{
           followerData:data.Follower
        })
    })
    .catch((err) => {
            res.send(err)
    })
})

route.get('/:id/following',(req,res) => {
    User.findOne({
        include: ["Following"],
        where:{
            id:req.params.id
        },
        order:["id"],
    })
    .then((data) => {
        res.render('following.ejs',{
           followingData:data.Following
        })
    })
    .catch((err) => {
        res.send(err)
    })
})

module.exports = route