/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('supportTickets', {
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
			field: 'user_id'
		},
		referenceId: {
			type: DataTypes.STRING(50),
			allowNull: false,
			field: 'referenceId'
		},
		subject: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'subject'
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'message'
		},
		status: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0',
			field: 'status'
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
		tableName: 'support_tickets'
	});
};
