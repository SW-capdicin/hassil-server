const Sequelize = require("sequelize");

module.exports = class Question extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          primaryKey: true,
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          unique: true,
        },
        user_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: {
            model: "user",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        title: {
          type: "varchar(45)",
          allowNull: false,
        },
        contents: {
          type: "varchar(255)",
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: "Question",
        tableName: "question",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.Question.belongsTo(db.User, {
      foreignKey: "user_id",
      onDelete: "CASCADE",
    });
    db.Question.hasOne(db.Answer, {
      foreignKey: "question_id",
    });
  }
};
