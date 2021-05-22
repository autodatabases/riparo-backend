/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('customDuties', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		originCountry: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'origin_country'
		},
		categoryId: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'category_id'
		},
		fees: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'fees'
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
		tableName: 'custom_duties'
	});
};
