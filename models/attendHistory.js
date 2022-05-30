const Sequelize = require('sequelize');

module.exports = class AttendHistory extends Sequelize.Model {
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
          onDelete: 'CASCADE',
        },
        studyMemberId: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: {
            model: 'StudyMember',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        status: {
          type: Sequelize.INTEGER.UNSIGNED,
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
        modelName: 'AttendHistory',
        tableName: 'AttendHistory',
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
    db.AttendHistory.belongsTo(db.Reservation, {
      foreignKey: 'reservationId',
      onDelete: 'CASCADE',
    });
    db.AttendHistory.belongsTo(db.StudyMember, {
      foreignKey: 'studyMemberId',
      onDelete: 'CASCADE',
    });
  }
};
