/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('taGetvehicleidsbycriteria', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		manuId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			field: 'manuId'
		},
		modId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			field: 'modId'
		},
		carId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			field: 'carId'
		},
		carStart: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'car_start'
		},
		carName: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'carName'
		},
		carType: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'carType'
		},
		constructionType: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'constructionType'
		},
		fuelType: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'fuelType'
		},
		motorType: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'motorType'
		},
		powerHpFrom: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'powerHpFrom'
		},
		powerHpTo: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'powerHpTo'
		},
		powerKwFrom: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'powerKwFrom'
		},
		powerKwTo: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'powerKwTo'
		},
		firstCountry: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'firstCountry'
		},
		yearOfConstrFrom: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'yearOfConstrFrom'
		},
		yearOfConstrTo: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'yearOfConstrTo'
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
		},
		status: {
			type: DataTypes.ENUM('Active','Inactive'),
			allowNull: false,
			defaultValue: 'Active',
			field: 'status'
		}
	}, {
		tableName: 'ta_getvehicleidsbycriteria'
	});
};
