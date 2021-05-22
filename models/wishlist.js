/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('wishlist', {
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
		type: {
			type: DataTypes.ENUM('EXTERNAL','TECDOC'),
			allowNull: false,
			defaultValue: 'EXTERNAL',
			field: 'type'
		},
		productId: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'productId'
		},
		product: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'product'
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
		}
	}, {
		tableName: 'wishlist'
	});
};
