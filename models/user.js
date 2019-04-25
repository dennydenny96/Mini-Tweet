'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Tweet, {
      foreignKey: 'UserId'
    })
    User.belongsToMany(models.User, {as: 'Follower', through: models.Follow, foreignKey: 'FollowingId'})
    User.belongsToMany(models.User, {as: 'Following', through: models.Follow, foreignKey: 'FollowerId'})
  };
  return User;
};