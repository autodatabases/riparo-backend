/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('taGetambrands', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		uniqueId: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'uniqueId'
		},
		brandId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'brandId'
		},
		brandLogoId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'brandLogoID'
		},
		brandName: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'brandName'
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
		tableName: 'ta_getambrands'
	});
};
