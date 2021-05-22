/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('faqs', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		faqCategoryId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'faq_category_id'
		},
		faqCategoryName: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'faq_category_name'
		},
		question: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'question'
		},
		answer: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'answer'
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
		tableName: 'faqs'
	});
};
