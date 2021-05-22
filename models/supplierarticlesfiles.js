/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('supplierarticlesfiles', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		supplierArticlesid: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'supplierArticlesid'
		},
		file: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'file'
		},
		isUrl: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'is_url'
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
		tableName: 'supplierarticlesfiles'
	});
};
