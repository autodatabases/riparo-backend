/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('taArticlePrices', {
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
		rentalPrice: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'rental_price'
		},
		salePrice: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'sale_price'
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
		tableName: 'ta_article_prices'
	});
};
