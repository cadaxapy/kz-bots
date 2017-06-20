'use stricts';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Kinos', {
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
        defaultValue: 2
      },
      state: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      day: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Kinos');
  }
};