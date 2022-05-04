const Sequelize = require('sequelize');

module.exports = class Answer extends Sequelize.Model {
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
        userId: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: {
            model: 'User',
            key: 'id',
          },
          //   onDelete: "CASCADE",
        },
        questionId: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: {
            model: 'Question',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        contents: {
          type: 'varchar(255)',
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
        modelName: 'Answer',
        tableName: 'Answer',
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
    db.Answer.belongsTo(db.User, {
      foreignKey: 'userId',
      //   onDelete: "CASCADE",
    });
    db.Answer.belongsTo(db.Question, {
      foreignKey: 'questionId',
      onDelete: 'CASCADE',
    });
  }
};
