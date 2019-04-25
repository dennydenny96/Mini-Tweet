'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    tweet: DataTypes.TEXT,
    UserId: DataTypes.INTEGER
  }, {});
  Tweet.associate = function(models) {
    // associations can be defined here
    Tweet.belongsTo(models.User, {
      foreignKey: 'UserId'
    })
  };
  return Tweet;
};