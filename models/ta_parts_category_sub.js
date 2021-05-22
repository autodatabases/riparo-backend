/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('taPartsCategorySub', {
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
		carType: {
			type: DataTypes.STRING(50),
			allowNull: false,
			field: 'carType'
		},
		assemblyGroupName: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'assemblyGroupName'
		},
		assemblyGroupNameEs: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'assemblyGroupName_es'
		},
		assemblyGroupNodeId: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'assemblyGroupNodeId'
		},
		hasChilds: {
			type: DataTypes.STRING(50),
			allowNull: false,
			field: 'hasChilds'
		},
		parentNodeId: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'parentNodeId'
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
		tableName: 'ta_parts_category_sub'
	});
};
