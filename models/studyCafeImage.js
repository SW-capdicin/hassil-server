const Sequelize = require("sequelize");

module.exports = class StudyCafeImage extends Sequelize.Model {
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
        src: {
          type: "varchar(255)",
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: "StudyCafeImage",
        tableName: "study_cafe_image",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.StudyCafeImage.belongsTo(db.StudyCafe, {
      foreignKey: "study_cafe_id",
      onDelete: "CASCADE",
    });
  }
};
