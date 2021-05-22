/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('articlerating', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		productId: {
			type: DataTypes.STRING(50),
			allowNull: false,
			field: 'productId'
		},
		name: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'name'
		},
		email: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'email'
		},
		review: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'review'
		},
		rating: {
			type: DataTypes.STRING(50),
			allowNull: false,
			field: 'rating'
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
		tableName: 'articlerating'
	});
};
