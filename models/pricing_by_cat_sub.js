/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('pricingByCatSub', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		categoryId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'category_id'
		},
		subCategoryId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'sub_category_id'
		},
		indirectExpense: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'indirect_expense'
		},
		indExp: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'ind_exp'
		},
		directCost: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'direct_cost'
		},
		tecPercent: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'tec_percent'
		},
		expectedProfit: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'expected_profit'
		},
		localTaxes: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'local_taxes'
		},
		discount: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'discount'
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
		tableName: 'pricing_by_cat_sub'
	});
};
