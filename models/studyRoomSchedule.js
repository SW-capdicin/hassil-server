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
        reservation_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: {
            model: 'reservation',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        studyroom_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: {
            model: 'study_room',
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
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      },
      {
        sequelize,
        modelName: 'StudyRoomSchedule',
        tableName: 'study_room_schedule',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        initialAutoIncrement: 1,
        timestamps: false,
        paranoid: false,
        underscored: true,
      },
    );
  }

  static associate(db) {
    db.StudyRoomSchedule.belongsTo(db.StudyRoom, {
      foreignKey: 'studyroom_id',
      onDelete: 'CASCADE',
    });
    db.StudyRoomSchedule.belongsTo(db.Reservation, {
      foreignKey: 'reservation_id',
      onDelete: 'CASCADE',
    });
  }
};
