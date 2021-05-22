/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('articlePriceRequests', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		name: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'name'
		},
		email: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'email'
		},
		articleNumber: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'article_number'
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'message'
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
		tableName: 'article_price_requests'
	});
};
