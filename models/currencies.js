/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('currencies', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		currencyCode: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'currencyCode'
		},
		currencyName: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'currencyName'
		},
		currencySymbol: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'currencySymbol'
		},
		currencyId: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'currencyId'
		},
		status: {
			type: DataTypes.ENUM('Active','Inactive'),
			allowNull: false,
			defaultValue: 'Inactive',
			field: 'status'
		},
		valueInCop: {
			type: DataTypes.STRING(191),
			allowNull: false,
			defaultValue: '0',
			field: 'value_in_cop'
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
		tableName: 'currencies'
	});
};
