const Sequelize = require("sequelize");

module.exports = class Study extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          primaryKey: true,
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          unique: true,
        },
        category_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: {
            model: "category",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        name: {
          type: "varchar(45)",
          allowNull: false,
        },
        info: {
          type: "longtext",
          allowNull: false,
        },
        meeting_cnt: {
          type: Sequelize.INTEGER.UNSIGNED,
          defaultValue: 0,
        },
        start_date: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        end_date: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        deposit_per_person: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        location: {
          type: "varchar(255)",
          allowNull: false,
        },
        operation_time: {
          type: "varchar(255)",
          allowNull: false,
        },
        min_person: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        max_person: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        absent_fee: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        late_fee: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        src: {
          type: "varchar(255)",
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: "Study",
        tableName: "study",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.Study.hasMany(db.StudyMember, {
      foreignKey: "study_id",
    });
    db.Study.hasMany(db.Comment, {
      foreignKey: "study_id",
    });
    db.Study.hasMany(db.Reservation, {
      foreignKey: "study_id",
    });
    db.Study.belongsTo(db.Category, {
      foreignKey: "category_id",
      onDelete: "CASCADE",
    });
  }
};
