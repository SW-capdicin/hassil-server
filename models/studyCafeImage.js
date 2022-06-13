const Sequelize = require('sequelize');

module.exports = class StudyCafeImage extends Sequelize.Model {
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
        modelName: 'StudyCafeImage',
        tableName: 'StudyCafeImage',
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
    db.StudyCafeImage.belongsTo(db.StudyCafe, {
      foreignKey: 'studyCafeId',
      onDelete: 'CASCADE',
    });
  }
};
