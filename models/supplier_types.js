/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('supplierTypes', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		code: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'code'
		},
		name: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'name'
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
		tableName: 'supplier_types'
	});
};
