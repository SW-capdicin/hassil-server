const Sequelize = require('sequelize');

module.exports = class Notice extends Sequelize.Model {
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
        userId: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: {
            model: 'User',
            key: 'id',
          },
          //   onDelete: "CASCADE",
        },
        title: {
          type: 'varchar(45)',
          allowNull: false,
        },
        contents: {
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
        modelName: 'Notice',
        tableName: 'Notice',
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
    db.Notice.belongsTo(db.User, {
      foreignKey: 'userId',
      //   onDelete: "CASCADE",
    });
  }
};
