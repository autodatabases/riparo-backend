/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('suppliers', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		businessName: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'businessName'
		},
		email: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'email'
		},
		isEmailVerified: {
			type: DataTypes.ENUM('Yes','No'),
			allowNull: false,
			defaultValue: 'No',
			field: 'is_email_verified'
		},
		logo: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'logo'
		},
		password: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'password'
		},
		country: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'country'
		},
		mobileNumber: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'mobileNumber'
		},
		phoneNumber: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'phoneNumber'
		},
		address: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'address'
		},
		city: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'city'
		},
		state: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'state'
		},
		pincode: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'pincode'
		},
		website: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'website'
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
		},
		status: {
			type: DataTypes.ENUM('Active','Inactive'),
			allowNull: false,
			defaultValue: 'Active',
			field: 'status'
		}
	}, {
		tableName: 'suppliers'
	});
};
