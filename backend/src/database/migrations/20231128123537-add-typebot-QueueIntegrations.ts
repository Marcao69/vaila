import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.addColumn("Queues", "typebotSlug", {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ""
    }),
    queryInterface.addColumn("Queues", "typebotUrl", {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ""
    }),
    queryInterface.addColumn("Queues", "typebotExpires", {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }),
    queryInterface.addColumn("Queues", "typebotKeywordFinish", {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ""
    }),
    queryInterface.addColumn("Queues", "typebotUnknownMessage", {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ""
    }),
    queryInterface.addColumn("Queues", "typebotDelayMessage", {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1000
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.removeColumn("Queues", "typebotSlug"),
    queryInterface.removeColumn("Queues", "typebotExpires"),
    queryInterface.removeColumn("Queues", "typebotKeywordFinish"),
    queryInterface.removeColumn("Queues", "typebotDelayMessage"),
    queryInterface.removeColumn("Queues", "typebotUnknownMessage");
  }
};