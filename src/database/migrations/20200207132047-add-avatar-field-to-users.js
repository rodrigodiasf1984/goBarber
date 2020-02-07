module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users', // nome da tabela que vai ser alterada
      'avatar_id', // nome da coluna a ser adicionada
      {
        type: Sequelize.INTEGER,
        references: { model: 'files', key: 'id' }, // chave estrangeira
        onUpdate: 'CASCADE', // se for alterado vai alterar o avatar_id na tabela users
        onDelete: 'SET NULL', // se o avatar for deletado
        allowNull: true
      }
    );
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'avatar_id');
  }
};
