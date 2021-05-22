/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('shippingInsurancePrices', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		shipmentType: {
			type: DataTypes.ENUM('Local','International'),
			allowNull: false,
			defaultValue: 'Local',
			field: 'shipment_type'
		},
		insuranceType: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'insurance_type'
		},
		rate: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'rate'
		},
		minimumValue: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'minimum_value'
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
		tableName: 'shipping_insurance_prices'
	});
};
