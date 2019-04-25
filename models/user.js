'use strict';
let bcrypt = require('bcryptjs')
let salt = bcrypt.genSaltSync(10)
const sequelize = require('sequelize')
const Op = sequelize.Op
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [6, 32],
          msg: 'Username minimum must 6 characters'
        },
        isUnique: function (input, next) {
          User.findOne({
            where: {
              username: input,
              id: { [Op.ne]: this.id }
            }
          })
            .then((data) => {
              if (data) {
                next(`${data.username} already exist, please try to use another username`)
              } else {
                next()
              }
            })
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [6, 32],
          msg: 'Password minimum must 6 characters'
        }
      }
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING
  }, {
      hooks: {
        beforeCreate: (input, options) => {
          input.password = bcrypt.hashSync(input.password, salt)
        }
      },
      sequelize
    });
  User.associate = function (models) {
    // associations can be defined here
    User.hasMany(models.Tweet, {
      foreignKey: 'UserId'
    })
    User.belongsToMany(models.User, { as: 'Follower', through: models.Follow, foreignKey: 'FollowingId' })
    User.belongsToMany(models.User, { as: 'Following', through: models.Follow, foreignKey: 'FollowerId' })
  };
  User.prototype.getFullname = function () {
    return [this.first_name, this.last_name].join(' ')
  }
  return User;
};