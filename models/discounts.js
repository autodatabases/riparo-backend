/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('discounts', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		carType: {
			type: DataTypes.STRING(20),
			allowNull: true,
			field: 'carType'
		},
		forBrands: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'for_brands'
		},
		forPartCategory: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'for_part_category'
		},
		code: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'code'
		},
		type: {
			type: DataTypes.ENUM('Fixed','Percent'),
			allowNull: false,
			defaultValue: 'Fixed',
			field: 'type'
		},
		discount: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'discount'
		},
		expiryDateTime: {
			type: DataTypes.DATE,
			allowNull: false,
			field: 'expiryDateTime'
		},
		maxRedemptions: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'max_redemptions'
		},
		text: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'text'
		},
		image: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'image'
		},
		isFeature: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0',
			field: 'is_feature'
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
		tableName: 'discounts'
	});
};
