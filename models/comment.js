const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model {
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
        contents: {
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
        modelName: 'Comment',
        tableName: 'comment',
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
    db.Comment.belongsTo(db.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });
    db.Comment.belongsTo(db.Study, {
      foreignKey: 'study_id',
      onDelete: 'CASCADE',
    });
  }
};
