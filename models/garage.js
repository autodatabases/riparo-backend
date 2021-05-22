/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('garage', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		userId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'userId'
		},
		licensePlate: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'licensePlate'
		},
		manuId: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'manuId'
		},
		modelId: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'modelId'
		},
		carId: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'carId'
		},
		soat: {
			type: DataTypes.DATEONLY,
			allowNull: false,
			field: 'soat'
		},
		revision: {
			type: DataTypes.DATEONLY,
			allowNull: false,
			field: 'revision'
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
		tableName: 'garage'
	});
};
