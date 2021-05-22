/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('ppCampaigns', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		title: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'title'
		},
		intervalBetweenMails: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'intervalBetweenMails'
		},
		timezone: {
			type: DataTypes.STRING(50),
			allowNull: false,
			field: 'timezone'
		},
		startDateTime: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'startDateTime'
		},
		endDateTime: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'endDateTime'
		},
		mailsPerDay: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'mailsPerDay'
		},
		blockOutDays: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'blockOutDays'
		},
		subject: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'subject'
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'message'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'createdAt'
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'updatedAt'
		},
		status: {
			type: DataTypes.ENUM('Active','Inactive'),
			allowNull: false,
			defaultValue: 'Active',
			field: 'status'
		}
	}, {
		tableName: 'pp_campaigns'
	});
};
