const Sequelize = require('sequelize');

module.exports = class StudyRoomSchedule extends Sequelize.Model {
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
        studyRoomId: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: {
            model: 'StudyRoom',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        time: {
          type: 'datetime',
          allowNull: false,
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
        modelName: 'StudyRoomSchedule',
        tableName: 'StudyRoomSchedule',
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
    db.StudyRoomSchedule.belongsTo(db.StudyRoom, {
      foreignKey: 'studyRoomId',
      onDelete: 'CASCADE',
    });
    db.StudyRoomSchedule.belongsTo(db.Reservation, {
      foreignKey: 'reservationId',
      onDelete: 'CASCADE',
    });
  }
};
