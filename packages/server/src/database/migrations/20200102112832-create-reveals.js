module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Reveals',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        voteId: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        juror: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        disputeId: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        roundNumber: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        outcome: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        salt: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        revealed: {
          allowNull: false,
          type: Sequelize.BOOLEAN,
          default: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        }
      }
    )

    return queryInterface.addConstraint('Reveals', ['juror', 'voteId'], {
      type: 'unique',
      name: 'unique_juror_vote'
    })
  },

  down: (queryInterface, Sequelize) =>
    queryInterface.dropTable('Reveals')
}
