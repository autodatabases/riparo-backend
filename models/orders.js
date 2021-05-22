/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('orders', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		tagId: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'tag_id'
		},
		orderNumber: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'order_number'
		},
		supplierId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'supplier_id'
		},
		userId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'userId'
		},
		amount: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'amount'
		},
		totalItems: {
			type: DataTypes.STRING(50),
			allowNull: false,
			field: 'totalItems'
		},
		items: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'items'
		},
		refPayco: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'ref_payco'
		},
		factura: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'factura'
		},
		description: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'description'
		},
		currency: {
			type: DataTypes.STRING(50),
			allowNull: false,
			field: 'currency'
		},
		coupon: {
			type: DataTypes.STRING(50),
			allowNull: true,
			field: 'coupon'
		},
		orderStatus: {
			type: DataTypes.ENUM('Pending','Delivered'),
			allowNull: false,
			defaultValue: 'Pending',
			field: 'orderStatus'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.fn('current_timestamp'),
			field: 'createdAt'
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.fn('current_timestamp'),
			field: 'updatedAt'
		}
	}, {
		tableName: 'orders'
	});
};
