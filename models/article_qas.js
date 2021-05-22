/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('articleQas', {
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
		productId: {
			type: DataTypes.STRING(50),
			allowNull: false,
			field: 'productId'
		},
		question: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'question'
		},
		answer: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: 'answer'
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
			field: 'created_at'
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.fn('current_timestamp'),
			field: 'updated_at'
		}
	}, {
		tableName: 'article_qas'
	});
};
