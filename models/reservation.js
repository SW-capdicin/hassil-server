const Sequelize = require('sequelize');

module.exports = class Reservation extends Sequelize.Model {
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
        studyId: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: {
            model: 'Study',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        reservatingUserId: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: {
            model: 'User',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        status: {
          type: Sequelize.INTEGER.UNSIGNED,
          defaultValue: 0,
        },
        personCnt: {
          type: Sequelize.INTEGER.UNSIGNED,
          defaultValue: 0,
        },
        attendCnt: {
          type: Sequelize.INTEGER.UNSIGNED,
          defaultValue: 0,
        },
        lateCnt: {
          type: Sequelize.INTEGER.UNSIGNED,
          defaultValue: 0,
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
        modelName: 'Reservation',
        tableName: 'Reservation',
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
    db.Reservation.hasMany(db.StudyRoomSchedule, {
      foreignKey: 'reservationId',
    });
    db.Reservation.belongsTo(db.Study, {
      foreignKey: 'studyId',
      onDelete: 'CASCADE',
    });
    db.Reservation.hasOne(db.Meeting, {
      foreignKey: 'reservationId',
    });
    db.Reservation.hasMany(db.AttendHistory, {
      foreignKey: 'reservationId',
    });
  }
};
