const Sequelize = require('sequelize');

module.exports = class Meeting extends Sequelize.Model {
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
        reservationId: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: {
            model: 'Reservation',
            key: 'id',
          },
        },
        longitude: {
          type: 'varchar(45)',
          allowNull: false,
        },
        latitude: {
          type: 'varchar(45)',
          allowNull: false,
        },
        time: {
          type: 'datetime',
          allowNull: false,
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
        modelName: 'Meeting',
        tableName: 'Meeting',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        initialAutoIncrement: 1,
        timestamps: false,
        paranoid: false,
        underscored: false,
      },
    );
  }

  static associate(db) {}
};
