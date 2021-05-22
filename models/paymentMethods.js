/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('paymentMethods', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		type: {
			type: DataTypes.ENUM('STRIPE','PAYPAL'),
			allowNull: false,
			defaultValue: 'STRIPE',
			field: 'type'
		},
		stripeKeySandbox: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'stripeKeySandbox'
		},
		stripeSecretSandbox: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'stripeSecretSandbox'
		},
		stripeKeyLive: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'stripeKeyLive'
		},
		stripeSecretLive: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'stripeSecretLive'
		},
		isStripeEnabled: {
			type: DataTypes.ENUM('Active','Inactive'),
			allowNull: true,
			defaultValue: 'Active',
			field: 'isStripeEnabled'
		},
		stripeActiveMode: {
			type: DataTypes.ENUM('SANDBOX','LIVE'),
			allowNull: true,
			defaultValue: 'SANDBOX',
			field: 'stripeActiveMode'
		},
		stripeTaxAmount: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'stripeTaxAmount'
		},
		stripeDefaultCurrency: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'stripeDefaultCurrency'
		},
		paypalUsername: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'paypalUsername'
		},
		paypalPassword: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'paypalPassword'
		},
		paypalSecret: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'paypalSecret'
		},
		paypalAppId: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'paypalAppId'
		},
		isPaypalEnabled: {
			type: DataTypes.ENUM('Active','Inactive'),
			allowNull: true,
			defaultValue: 'Active',
			field: 'isPaypalEnabled'
		},
		paypalActiveMode: {
			type: DataTypes.ENUM('SANDBOX','LIVE'),
			allowNull: true,
			defaultValue: 'SANDBOX',
			field: 'paypalActiveMode'
		},
		paypalTaxAmount: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'paypalTaxAmount'
		},
		paypalDefaultCurrency: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'paypalDefaultCurrency'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'created_at'
		}
	}, {
		tableName: 'paymentMethods',
		timestamps: false
	});
};
