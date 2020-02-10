module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('appointments', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      user_id: {
        // essa relação é para quando um user fizer um agendamento
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // Quando um user for deletado, apaga o relacionamento com os agedamentos do mesmo
        allowNull: true
      },
      provider_id: {
        // essa relação é para marcar qual é o prestador de serviços
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // Quando um user for deletado, apaga o relacionamento com os agedamentos do mesmo
        allowNull: true
      },
      canceled_at: {
        type: Sequelize.DATE
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('appointments');
  }
};
