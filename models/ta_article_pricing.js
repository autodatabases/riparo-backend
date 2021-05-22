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
		supplierId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'supplier_id'
		},
		supplierName: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'supplier_name'
		},
		price: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'price'
		},
		currency: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'currency'
		},
		zoneNumber: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'zone_number'
		},
		country: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'country'
		},
		weight: {
			type: DataTypes.STRING(191),
			allowNull: false,
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
