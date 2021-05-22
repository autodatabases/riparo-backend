/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('countries', {
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
		alpha2Code: {
			type: DataTypes.STRING(50),
			allowNull: false,
			field: 'alpha2Code'
		},
		alpha3Code: {
			type: DataTypes.STRING(50),
			allowNull: false,
			field: 'alpha3Code'
		},
		callingCodes: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'callingCodes'
		},
		flag: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'flag'
		},
		region: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'region'
		},
		timezones: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'timezones'
		},
		currencies: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'currencies'
		}
	}, {
		tableName: 'countries',
		timestamps : false
	});
};
