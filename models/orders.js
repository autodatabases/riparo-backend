/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "orders",
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
      },
      orderNumber: {
        type: DataTypes.STRING(191),
        allowNull: false,
        field: "order_number",
        unique: true,
      },
      supplierId: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        field: "supplier_id",
      },
      userId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: "userId",
      },
      total: {
        type: DataTypes.STRING(191),
        allowNull: false,
        field: "total",
      },
      totalOrderItems: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "total_order_items",
      },
      merchantOrder: {
        type: DataTypes.STRING(191),
        allowNull: false,
        field: "merchant_order_id",
      },
      Payment: {
        type: DataTypes.STRING(191),
        allowNull: true,
        field: "payment_id",
      },
      currency: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "currency",
      },
      coupon: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "coupon",
      },
      orderStatus: {
        type: DataTypes.ENUM(
          "success",
          "failure",
          "pending",
          "on_the_way",
          "delivered"
        ),
        allowNull: false,
        defaultValue: "Pending",
        field: "orderStatus",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn("current_timestamp"),
        field: "createdAt",
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn("current_timestamp"),
        field: "updatedAt",
      },
    },
    {
      tableName: "orders",
    }
  );
};
