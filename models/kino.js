module.exports = (sequelize, DataTypes) => {
  var Kino = sequelize.define('Kino', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    city: {
      type: DataTypes.INTEGER,
      defaultValue: 2
    },
    state: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    day: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
      },
    },
  });

  return Kino;
};