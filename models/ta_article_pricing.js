/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('taArticlePricing', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		articleNumber: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'article_number'
		},
    articleOEM: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'article_oem'
		},
		supplierId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'supplier_id'
		},
		supplierName: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'supplier_name'
		},
		priceFreeTax: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'priceFreeTax'
		},
    priceWithTax: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'priceWithTax'
		},
		currency: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'currency'
		},
		zoneNumber: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'zone_number'
		},
		country: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'country'
		},
		weight: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'weight'
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
		tableName: 'ta_article_pricing'
	});
};
