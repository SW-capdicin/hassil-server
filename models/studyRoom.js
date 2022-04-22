const Sequelize = require("sequelize");

module.exports = class StudyRoom extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          primaryKey: true,
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          unique: true,
        },
        study_cafe_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: {
            model: "study_cafe",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        max_person: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        price_per_hour: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        src: {
          type: "varchar(255)",
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: "StudyRoom",
        tableName: "study_room",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.StudyRoom.belongsTo(db.StudyCafe, {
      foreignKey: "study_cafe_id",
      onDelete: "CASCADE",
    });
    db.StudyRoom.hasMany(db.StudyRoomSchedule, {
      foreignKey: "studyroom_id",
    });
  }
};
