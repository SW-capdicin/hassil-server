const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
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
        email: {
          type: 'varchar(45)',
          allowNull: false,
        },
        pid: {
          type: 'varchar(45)',
          allowNull: false,
        },
        nickname: {
          type: 'varchar(45)',
          allowNull: false,
        },
        phone_number: {
          type: 'varchar(45)',
          allowNull: false,
        },
        point: {
          type: Sequelize.INTEGER.UNSIGNED,
          defaultValue: 0,
        },
        type: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        name: {
          type: 'varchar(45)',
          allowNull: false,
        },
        bank_name: {
          type: 'varchar(45)',
          allowNull: false,
        },
        bank_account: {
          type: 'varchar(45)',
          allowNull: false,
        },
        src: {
          type: 'varchar(255)',
          allowNull: true,
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
        modelName: 'User',
        tableName: 'user',
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
    db.User.hasMany(db.StudyCafe, {
      foreignKey: 'user_id',
    });
    db.User.hasMany(db.Review, {
      foreignKey: 'user_id',
    });
    db.User.hasMany(db.Notice, {
      foreignKey: 'user_id',
    });
    db.User.hasMany(db.Question, {
      foreignKey: 'user_id',
    });
    db.User.hasMany(db.Answer, {
      foreignKey: 'user_id',
    });
    db.User.hasMany(db.StudyMember, {
      foreignKey: 'user_id',
    });
    db.User.hasMany(db.Comment, {
      foreignKey: 'user_id',
    });
    db.User.hasMany(db.PointHistory, {
      foreignKey: 'user_id',
    });
  }
};
