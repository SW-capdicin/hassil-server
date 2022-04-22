const Sequelize = require("sequelize");

module.exports = class PointHistory extends Sequelize.Model {
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
          //   onDelete: "CASCADE",
        },
        balance: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        amount: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        status: {
          type: Sequelize.TINYINT,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: "PointHistory",
        tableName: "point_history",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.PointHistory.belongsTo(db.User, {
      foreignKey: "user_id",
      //   onDelete: "CASCADE",
    });
  }
};
