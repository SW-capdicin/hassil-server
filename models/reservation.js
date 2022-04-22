const Sequelize = require("sequelize");

module.exports = class Reservation extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          primaryKey: true,
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          unique: true,
        },
        study_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: {
            model: "study",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        reservation_person_name: {
          type: "varchar(45)",
          allowNull: false,
        },
        status: {
          type: Sequelize.INTEGER.UNSIGNED,
          defaultValue: 0,
        },
        longitude: {
          type: "varchar(45)",
          // allowNull: false,
        },
        latitude: {
          type: "varchar(45)",
          // allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: "Reservation",
        tableName: "reservation",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.Reservation.belongsTo(db.Study, {
      foreignKey: "study_id",
      onDelete: "CASCADE",
    });
    db.Reservation.hasMany(db.StudyRoomSchedule, {
      foreignKey: "reservation_id",
    });
  }
};
