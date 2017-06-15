'use stricts';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Currencies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      city: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      state: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Currencies');
  }
};