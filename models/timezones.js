/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('timezones', {
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
		timezone: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'timezone'
		}
	}, {
		tableName: 'timezones',
		timestamps: false
	});
};
