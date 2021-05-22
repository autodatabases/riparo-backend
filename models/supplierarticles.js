/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('supplierarticles', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		supplierId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'supplierId'
		},
		carType: {
			type: DataTypes.STRING(20),
			allowNull: false,
			field: 'carType'
		},
		manuId: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'manuId'
		},
		modelId: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'modelId'
		},
		carId: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'carId'
		},
		categoryId: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'categoryId'
		},
		subCategoryid: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'subCategoryid'
		},
		subSubCategoryid: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'subSubCategoryid'
		},
		articleName: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'articleName'
		},
		articleDescription: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'articleDescription'
		},
		quantityPerPackingUnit: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'quantityPerPackingUnit'
		},
		warranty: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'warranty'
		},
		inStock: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'inStock'
		},
		retailPrice: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'retailPrice'
		},
		priceCurrency: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'price_currency'
		},
		salePrice: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'salePrice'
		},
		discountedPrice: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'discountedPrice'
		},
		weightKg: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'weight_kg'
		},
		lengthCm: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'length_cm'
		},
		widthCm: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'width_cm'
		},
		heightCm: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'height_cm'
		},
		inStockNumber: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'in_stock_number'
		},
		commissionType: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'commissionType'
		},
		commissionValue: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'commissionValue'
		},
		baseInsuranceValue: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'base_insurance_value'
		},
		indirectExpense: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'indirect_expense'
		},
		directCost: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'direct_cost'
		},
		tecPercent: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'tec_percent'
		},
		expectedProfit: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'expected_profit'
		},
		localTaxes: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'local_taxes'
		},
		discount: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'discount'
		},
		articleMfr: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'articleMfr'
		},
		isApproved: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0',
			field: 'is_approved'
		},
		zoneNumber: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'zone_number'
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
		},
		status: {
			type: DataTypes.ENUM('Active','Inactive'),
			allowNull: false,
			defaultValue: 'Active',
			field: 'status'
		}
	}, {
		tableName: 'supplierarticles'
	});
};
