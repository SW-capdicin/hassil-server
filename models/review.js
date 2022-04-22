const Sequelize = require("sequelize");

module.exports = class Review extends Sequelize.Model {
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
        user_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: {
            model: "user",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        contents: {
          type: "varchar(255)",
          allowNull: false,
        },
        rating: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: "Review",
        tableName: "review",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.Review.belongsTo(db.User, {
      foreignKey: "user_id",
      onDelete: "CASCADE",
    });
    db.Review.belongsTo(db.StudyCafe, {
      foreignKey: "study_cafe_id",
      onDelete: "CASCADE",
    });
  }
};
