/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('freightZoneCountries', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		zoneNumber: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'zone_number'
		},
		englishName: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'english_name'
		},
		spanishName: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'spanish_name'
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
		tableName: 'freight_zone_countries'
	});
};
