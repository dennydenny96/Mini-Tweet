'use strict';
let bcrypt = require('bcryptjs')
let salt = bcrypt.genSaltSync(10)
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
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
    User.belongsToMany(models.User, { as: 'followings', through: 'Follows', foreignKey: 'FollowingId' })
    User.belongsToMany(models.User, { as: 'followers', through: 'Follows', foreignKey: 'FollowerId' })
  };
  User.prototype.getFullname = function () {
    return [this.first_name, this.last_name].join(' ')
  }
  return User;
};