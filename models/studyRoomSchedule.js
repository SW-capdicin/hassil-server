const Sequelize = require("sequelize");

module.exports = class StudyRoomSchedule extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          primaryKey: true,
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          unique: true,
        },
        reservation_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: {
            model: "reservation",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        studyroom_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: {
            model: "study_room",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        time: {
          type: "datetime",
          allowNull: false,
        },
        status: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: "StudyRoomSchedule",
        tableName: "study_room_schedule",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.StudyRoomSchedule.belongsTo(db.StudyRoom, {
      foreignKey: "studyroom_id",
      onDelete: "CASCADE",
    });
    db.StudyRoomSchedule.belongsTo(db.Reservation, {
      foreignKey: "reservation_id",
      onDelete: "CASCADE",
    });
  }
};
