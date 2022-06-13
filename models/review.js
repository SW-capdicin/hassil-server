const Sequelize = require('sequelize');

module.exports = class Review extends Sequelize.Model {
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
        studyCafeId: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: {
            model: 'StudyCafe',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        userId: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: {
            model: 'User',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        contents: {
          type: 'varchar(255)',
          allowNull: false,
        },
        rating: {
          type: Sequelize.INTEGER.UNSIGNED,
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
        modelName: 'Review',
        tableName: 'Review',
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
    db.Review.belongsTo(db.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    db.Review.belongsTo(db.StudyCafe, {
      foreignKey: 'studyCafeId',
      onDelete: 'CASCADE',
    });
  }
};
