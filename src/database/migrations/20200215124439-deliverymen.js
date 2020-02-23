module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('deliverymens', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      avatar_id: {
        type: Sequelize.INTEGER,
        references: { model: 'files', key: 'id' },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      on_duty: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: 0,
      },
      retrieved: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('deliverymens');
  },
};
