module.exports = (sequelize, DataTypes) => {
  var Chat = sequelize.define('ChatMessage', {
    chat_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      defaultValue: ""
    }
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
      },
    },
  });

  return Chat;
};