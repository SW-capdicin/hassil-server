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
        studyCafeId: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: {
            model: 'StudyCafe',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        maxPerson: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        pricePerHour: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        src: {
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
        modelName: 'StudyRoom',
        tableName: 'StudyRoom',
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
    db.StudyRoom.belongsTo(db.StudyCafe, {
      foreignKey: 'studyCafeId',
      onDelete: 'CASCADE',
    });
    db.StudyRoom.hasMany(db.StudyRoomSchedule, {
      foreignKey: 'studyRoomId',
    });
  }
};
