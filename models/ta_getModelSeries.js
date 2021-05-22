/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('taGetmodelseries', {
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
		modelId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			field: 'modelId'
		},
		modelStart: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'model_start'
		},
		modelname: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'modelname'
		},
		yearOfConstrFrom: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'yearOfConstrFrom'
		},
		yearOfConstrTo: {
			type: DataTypes.TEXT,
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
		tableName: 'ta_getmodelseries'
	});
};
