/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('riparoFriends', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		riparoFriendCategory: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: 'riparo_friend_category'
		},
		title: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'title'
		},
		opening: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'opening'
		},
		address: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'address'
		},
		featuredImage: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'featured_image'
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'description'
		},
		telephone: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'telephone'
		},
		website: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'website'
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
		tableName: 'riparo_friends'
	});
};
