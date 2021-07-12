/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "orderItems",
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
      },
      orderId: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        field: "order_id",
      },
      articleNumber: {
        type: DataTypes.STRING(191),
        allowNull: true,
        field: "article_number",
      },
      supplierName: {
        type: DataTypes.STRING(191),
        allowNull: true,
        field: "supplier_name",
      },
      quantity: {
        type: DataTypes.STRING(191),
        allowNull: true,
        field: "quantity",
      },
      price: {
        type: DataTypes.STRING(191),
        allowNull: true,
        field: "price",
      },
      total: {
        type: DataTypes.STRING(191),
        allowNull: true,
        field: "total",
      },
    },
    {
      tableName: "order_items",
    }
  );
};
