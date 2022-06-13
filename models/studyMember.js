const Sequelize = require('sequelize');

module.exports = class StudyMember extends Sequelize.Model {
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
        studyId: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: {
            model: 'Study',
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
        attendCnt: {
          type: Sequelize.INTEGER.UNSIGNED,
          defaultValue: 0,
        },
        lateCnt: {
          type: Sequelize.INTEGER.UNSIGNED,
          defaultValue: 0,
        },
        isAlive: {
          type: Sequelize.INTEGER.UNSIGNED,
          defaultValue: 1,
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
        modelName: 'StudyMember',
        tableName: 'StudyMember',
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
    db.StudyMember.belongsTo(db.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    db.StudyMember.belongsTo(db.Study, {
      foreignKey: 'studyId',
      onDelete: 'CASCADE',
    });
    db.StudyMember.hasMany(db.AttendHistory, {
      foreignKey: 'studyMemberId',
    });
  }
};
