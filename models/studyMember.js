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
        study_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: {
            model: 'study',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        user_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: {
            model: 'user',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        late_cnt: {
          type: Sequelize.INTEGER.UNSIGNED,
          defaultValue: 0,
        },
        absent_cnt: {
          type: Sequelize.INTEGER.UNSIGNED,
          defaultValue: 0,
        },
        is_alive: {
          type: Sequelize.INTEGER.UNSIGNED,
          defaultValue: 1,
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
        modelName: 'StudyMember',
        tableName: 'study_member',
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
    db.StudyMember.belongsTo(db.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });
    db.StudyMember.belongsTo(db.Study, {
      foreignKey: 'study_id',
      onDelete: 'CASCADE',
    });
  }
};
