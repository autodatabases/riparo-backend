/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('taPartsCategory', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		shortCutId: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'shortCutId'
		},
		shortCutName: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'shortCutName'
		},
		shortCutNameEs: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'shortCutName_es'
		},
		carType: {
			type: DataTypes.STRING(50),
			allowNull: false,
			field: 'carType'
		},
		image: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'image'
		},
		assemblyGroupNodeId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'assemblyGroupNodeId'
		},
		isFeatured: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0',
			field: 'is_featured'
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
		tableName: 'ta_parts_category'
	});
};
