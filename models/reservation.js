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
        study_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: {
            model: 'study',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        reservation_person_name: {
          type: 'varchar(45)',
          allowNull: false,
        },
        status: {
          type: Sequelize.INTEGER.UNSIGNED,
          defaultValue: 0,
        },
        longitude: {
          type: 'varchar(45)',
          // allowNull: false,
        },
        latitude: {
          type: 'varchar(45)',
          // allowNull: false,
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
        modelName: 'Reservation',
        tableName: 'reservation',
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
    db.Reservation.belongsTo(db.Study, {
      foreignKey: 'study_id',
      onDelete: 'CASCADE',
    });
    db.Reservation.hasMany(db.StudyRoomSchedule, {
      foreignKey: 'reservation_id',
    });
  }
};
