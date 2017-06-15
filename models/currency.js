module.exports = (sequelize, DataTypes) => {
  var Currency = sequelize.define('Currency', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      defaultValue: '/kurs/almaty'
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