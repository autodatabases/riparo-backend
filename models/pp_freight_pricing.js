/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('ppFreightPricing', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		title: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'title'
		},
		shippingPrice: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'shipping_price'
		},
		orderPrice: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'order_price'
		},
		icon: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'icon'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'created_at'
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'updated_at'
		},
		status: {
			type: DataTypes.ENUM('Active','Inactive'),
			allowNull: false,
			defaultValue: 'Active',
			field: 'status'
		}
	}, {
		tableName: 'pp_freight_pricing'
	});
};
