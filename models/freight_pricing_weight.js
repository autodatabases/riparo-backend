/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('freightPricingWeight', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		weight: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'weight'
		},
		zoneNumberFrom: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'zone_number_from'
		},
		zoneNumberTo: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'zone_number_to'
		},
		price: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'price'
		},
		localTaxes: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'local_taxes'
		},
		expressDelivery: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'express_delivery'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.fn('current_timestamp'),
			field: 'created_at'
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.fn('current_timestamp'),
			field: 'updated_at'
		}
	}, {
		tableName: 'freight_pricing_weight'
	});
};
