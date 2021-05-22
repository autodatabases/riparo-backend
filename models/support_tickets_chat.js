/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('supportTicketsChat', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		referenceId: {
			type: DataTypes.STRING(50),
			allowNull: false,
			field: 'referenceId'
		},
		senderId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'senderId'
		},
		recieverId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'recieverId'
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'message'
		},
		isRead: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0',
			field: 'is_read'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			field: 'createdAt'
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.fn('current_timestamp'),
			field: 'updatedAt'
		}
	}, {
		tableName: 'support_tickets_chat'
	});
};
