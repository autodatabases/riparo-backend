/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('blogNews', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		title: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'title'
		},
		shortDescription: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'short_description'
		},
		date: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'date'
		},
		featuredImage: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'featured_image'
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'description'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'created_at'
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'updated_at'
		},
		status: {
			type: DataTypes.ENUM('Active','Inactive'),
			allowNull: false,
			defaultValue: 'Active',
			field: 'status'
		}
	}, {
		tableName: 'blog_news'
	});
};
