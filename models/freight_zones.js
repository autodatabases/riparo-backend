/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('freightZones', {
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
		code: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'code'
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
		tableName: 'freight_zones'
	});
};
