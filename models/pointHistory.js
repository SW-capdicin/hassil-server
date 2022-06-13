const Sequelize = require('sequelize');

module.exports = class PointHistory extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          primaryKey: true,
          type: Sequelize.INTEGER.UNSIGNED,
          autoIncrement: true,
          allowNull: false,
          unique: true,
        },
        userId: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: {
            model: 'User',
            key: 'id',
          },
        },
        balance: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        amount: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        status: {
          type: Sequelize.TINYINT,
          allowNull: false,
        },
        content: {
          type: 'varchar(255)',
          allowNull: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      },
      {
        sequelize,
        modelName: 'PointHistory',
        tableName: 'PointHistory',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        initialAutoIncrement: 1,
        timestamps: false,
        paranoid: false,
        underscored: false,
      },
    );
  }

  static associate(db) {
    db.PointHistory.belongsTo(db.User, {
      foreignKey: 'userId',
    });
  }
};
