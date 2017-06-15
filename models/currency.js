module.exports = (sequelize, DataTypes) => {
  var Currency = sequelize.define('Currency', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      defaultValue: '/city/almaty'
    }
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
      },
    },
  });

  return Currency;
};