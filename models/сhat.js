module.exports = (sequelize, DataTypes) => {
  var Chat = sequelize.define('Chat', {
    chat_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
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