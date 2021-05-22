/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('ppTaxManagement', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			field: 'id'
		},
		vat: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'vat'
		},
		baseInsurance: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'base_insurance'
		},
		customDutiesWeight: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'custom_duties_weight'
		},
		customDutiesPrice: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'custom_duties_price'
		}
	}, {
		tableName: 'pp_tax_management',
		timestamps:false
	});
};
