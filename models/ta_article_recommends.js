/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('taArticleRecommends', {
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
		isRecommended: {
			type: DataTypes.ENUM('Active','Inactive'),
			allowNull: false,
			defaultValue: 'Inactive',
			field: 'is_recommended'
		},
		isFeatured: {
			type: DataTypes.ENUM('Active','Inactive'),
			allowNull: false,
			defaultValue: 'Inactive',
			field: 'is_featured'
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
		tableName: 'ta_article_recommends'
	});
};
