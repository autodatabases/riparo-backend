/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('runtregisteredvehicles', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		vehicleRegisteredId: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: 'vehicleRegisteredId'
		},
		vehicleType: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'vehicleType'
		},
		vehicleBrand: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'vehicleBrand'
		},
		vehicleModel: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'vehicleModel'
		},
		vehicleBodyWork: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'vehicleBodyWork'
		},
		vehicleRegisteredYear: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'vehicleRegisteredYear'
		},
		vehicleDisplacement: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'vehicleDisplacement'
		},
		vehicleFuelType: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'vehicleFuelType'
		},
		vin: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'VIN'
		},
		vehicleChassisNumber: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'vehicleChassisNumber'
		},
		vehicleSerialNumber: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'vehicleSerialNumber'
		},
		vehiclePlateNumber: {
			type: DataTypes.STRING(50),
			allowNull: true,
			field: 'vehiclePlateNumber'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			field: 'createdAt'
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			field: 'updatedAt'
		},
		status: {
			type: DataTypes.ENUM('Active','Inactive'),
			allowNull: false,
			defaultValue: 'Active',
			field: 'status'
		}
	}, {
		tableName: 'runtregisteredvehicles'
	});
};
