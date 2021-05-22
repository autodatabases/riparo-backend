/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('globalSettings', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		metaKey: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'metaKey'
		},
		metaValue: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'metaValue'
		}
	}, {
		tableName: 'globalSettings',
		timestamps : false
	});
};
