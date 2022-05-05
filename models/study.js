const Sequelize = require('sequelize');

module.exports = class Study extends Sequelize.Model {
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
        categoryId: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: {
            model: 'Category',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        name: {
          type: 'varchar(45)',
          allowNull: false,
        },
        info: {
          type: 'longtext',
          allowNull: false,
        },
        meetingCnt: {
          type: Sequelize.INTEGER.UNSIGNED,
          defaultValue: 0,
        },
        startDate: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        endDate: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        depositPerPerson: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        location: {
          type: 'varchar(255)',
          allowNull: true,
        },
        operationTime: {
          type: 'varchar(255)',
          allowNull: false,
        },
        minPerson: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        maxPerson: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        absentFee: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        lateFee: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
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
        modelName: 'Study',
        tableName: 'Study',
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
    db.Study.hasMany(db.StudyMember, {
      foreignKey: 'studyId',
    });
    db.Study.hasMany(db.Comment, {
      foreignKey: 'studyId',
    });
    db.Study.hasMany(db.Reservation, {
      foreignKey: 'studyId',
    });
    db.Study.belongsTo(db.Category, {
      foreignKey: 'categoryId',
      onDelete: 'CASCADE',
    });
  }
};
