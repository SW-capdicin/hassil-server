const Sequelize = require('sequelize');

module.exports = class StudyCafe extends Sequelize.Model {
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
          onDelete: 'CASCADE',
        },
        longitude: {
          type: 'varchar(45)',
          allowNull: false,
        },
        latitude: {
          type: 'varchar(45)',
          allowNull: false,
        },
        address: {
          type: 'varchar(45)',
          allowNull: false,
        },
        region2DepthName: {
          type: 'varchar(45)',
          allowNull: false,
        },
        shopNumber: {
          type: 'varchar(45)',
          allowNull: false,
        },
        name: {
          type: 'varchar(45)',
          allowNull: false,
        },
        info: {
          type: 'longtext',
          allowNull: false,
        },
        operationTime: {
          type: 'varchar(255)',
          allowNull: false,
        },
        rating: {
          type: Sequelize.FLOAT,
          defaultValue: 0,
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
        modelName: 'StudyCafe',
        tableName: 'StudyCafe',
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
    db.StudyCafe.belongsTo(db.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    db.StudyCafe.hasMany(db.Review, {
      foreignKey: 'studyCafeId',
    });
    db.StudyCafe.hasMany(db.StudyCafeImage, {
      foreignKey: 'studyCafeId',
    });
    db.StudyCafe.hasMany(db.StudyRoom, {
      foreignKey: 'studyCafeId',
    });
  }
};
