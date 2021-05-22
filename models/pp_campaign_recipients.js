/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('ppCampaignRecipients', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		campaignId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'campaign_id'
		},
		firstName: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'first_name'
		},
		lastName: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'last_name'
		},
		email: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'email'
		},
		hasUnsubscribed: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0',
			field: 'has_unsubscribed'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'created_at'
		}
	}, {
		tableName: 'pp_campaign_recipients',
		timestamps: false
	});
};
