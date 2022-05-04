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
          allowNull: true,
        },
        pid: {
          type: 'varchar(45)',
          allowNull: false,
        },
        nickname: {
          type: 'varchar(45)',
          allowNull: true,
        },
        phoneNumber: {
          type: 'varchar(45)',
          allowNull: true,
        },
        point: {
          type: Sequelize.INTEGER.UNSIGNED,
          defaultValue: 0,
        },
        type: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: true,
        },
        name: {
          type: 'varchar(45)',
          allowNull: true,
        },
        bankName: {
          type: 'varchar(45)',
          allowNull: true,
        },
        bankAccount: {
          type: 'varchar(45)',
          allowNull: true,
        },
        src: {
          type: 'varchar(255)',
          allowNull: true,
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
        modelName: 'User',
        tableName: 'User',
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
    db.User.hasMany(db.StudyCafe, {
      foreignKey: 'userId',
    });
    db.User.hasMany(db.Review, {
      foreignKey: 'userId',
    });
    db.User.hasMany(db.Notice, {
      foreignKey: 'userId',
    });
    db.User.hasMany(db.Question, {
      foreignKey: 'userId',
    });
    db.User.hasMany(db.Answer, {
      foreignKey: 'userId',
    });
    db.User.hasMany(db.StudyMember, {
      foreignKey: 'userId',
    });
    db.User.hasMany(db.Comment, {
      foreignKey: 'userId',
    });
    db.User.hasMany(db.PointHistory, {
      foreignKey: 'userId',
    });
  }
};
