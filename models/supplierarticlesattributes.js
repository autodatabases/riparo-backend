/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('supplierarticlesattributes', {
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
		name: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'name'
		},
		value: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'value'
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
			type: DataTypes.ENUM('Active','InActive'),
			allowNull: false,
			defaultValue: 'Active',
			field: 'status'
		}
	}, {
		tableName: 'supplierarticlesattributes'
	});
};
