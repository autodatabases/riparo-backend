/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('taGetmanufacturers', {
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
		manuName: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'manuName'
		},
		linkingType: {
			type: DataTypes.STRING(10),
			allowNull: false,
			defaultValue: 'P',
			field: 'linkingType'
		},
		image: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'image'
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
		tableName: 'ta_getmanufacturers'
	});
};
