const Sequelize = require('sequelize');

module.exports = class Reservation extends Sequelize.Model {
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
        reservationPersonName: {
          type: 'varchar(45)',
          allowNull: false,
        },
        status: {
          type: Sequelize.INTEGER.UNSIGNED,
          defaultValue: 0,
        },
        longitude: {
          type: 'varchar(45)',
          allowNull: true,
        },
        latitude: {
          type: 'varchar(45)',
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
        modelName: 'Reservation',
        tableName: 'Reservation',
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
    db.Reservation.belongsTo(db.Study, {
      foreignKey: 'studyId',
      onDelete: 'CASCADE',
    });
    db.Reservation.hasMany(db.StudyRoomSchedule, {
      foreignKey: 'reservationId',
    });
  }
};
