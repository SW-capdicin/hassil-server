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
        user_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: {
            model: 'user',
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
        shop_number: {
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
        operation_time: {
          type: 'varchar(255)',
          allowNull: false,
        },
        rating: {
          type: Sequelize.FLOAT,
          defaultValue: 0,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      },
      {
        sequelize,
        modelName: 'StudyCafe',
        tableName: 'study_cafe',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        initialAutoIncrement: 1,
        timestamps: false,
        paranoid: false,
        underscored: true,
      },
    );
  }

  static associate(db) {
    db.StudyCafe.belongsTo(db.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });
    db.StudyCafe.hasMany(db.Review, {
      foreignKey: 'study_cafe_id',
    });
    db.StudyCafe.hasMany(db.StudyCafeImage, {
      foreignKey: 'study_cafe_id',
    });
    db.StudyCafe.hasMany(db.StudyRoom, {
      foreignKey: 'study_cafe_id',
    });
  }
};
