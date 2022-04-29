const Sequelize = require('sequelize');

module.exports = class StudyRoom extends Sequelize.Model {
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
        study_cafe_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: {
            model: 'study_cafe',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        max_person: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        price_per_hour: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        src: {
          type: 'varchar(255)',
          allowNull: false,
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
        modelName: 'StudyRoom',
        tableName: 'study_room',
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
    db.StudyRoom.belongsTo(db.StudyCafe, {
      foreignKey: 'study_cafe_id',
      onDelete: 'CASCADE',
    });
    db.StudyRoom.hasMany(db.StudyRoomSchedule, {
      foreignKey: 'studyroom_id',
    });
  }
};
