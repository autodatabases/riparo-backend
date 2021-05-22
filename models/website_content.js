/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('websiteContent', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		logo: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'logo'
		},
		privacyPolicy: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'privacy_policy'
		},
		returnRefund: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: 'return_refund'
		},
		shippingTrack: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: 'shipping_track'
		},
		payment: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: 'payment'
		},
		termsConditions: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'terms_conditions'
		},
		aboutUs: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'about_us'
		},
		operationModel: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: 'operation_model'
		},
		alliances: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: 'alliances'
		},
		contactEmail: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'contact_email'
		},
		contactPhoneNumber: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'contact_phone_number'
		},
		address: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'address'
		},
		facebookLink: {
			type: DataTypes.STRING(50),
			allowNull: true,
			field: 'facebook_link'
		},
		instagramLink: {
			type: DataTypes.STRING(50),
			allowNull: true,
			field: 'instagram_link'
		},
		twitterLink: {
			type: DataTypes.STRING(50),
			allowNull: true,
			field: 'twitter_link'
		}
	}, {
		tableName: 'website_content',
		timestamps: false
	});
};
