import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.addColumn("Queues", "typebotKeywordRestart", {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ""
    }),
    queryInterface.addColumn("Queues", "typebotRestartMessage", {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ""
    })
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.removeColumn("Queues", "typebotKeywordRestart"),
    queryInterface.removeColumn("Queues", "typebotRestartMessage")
  }
};