/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('users', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		stripeCustomerId: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'stripe_customer_id'
		},
		token: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'token'
		},
		socialId: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'socialId'
		},
		uniqueId: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'unique_id'
		},
		socialLoginType: {
			type: DataTypes.STRING(10),
			allowNull: true,
			field: 'socialLoginType'
		},
		firstName: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'first_name'
		},
		lastName: {
			type: DataTypes.STRING(191),
			allowNull: false,
			field: 'last_name'
		},
		email: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'email'
		},
		isEmailVerified: {
			type: DataTypes.ENUM('Yes','Pending'),
			allowNull: false,
			defaultValue: 'Pending',
			field: 'is_email_verified'
		},
		gender: {
			type: DataTypes.ENUM('Male','Female'),
			allowNull: true,
			field: 'gender'
		},
		profilePicture: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'profile_picture'
		},
		address: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'address'
		},
		city: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'city'
		},
		state: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'state'
		},
		dob: {
			type: DataTypes.DATEONLY,
			allowNull: true,
			field: 'dob'
		},
		pincode: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'pincode'
		},
		businessName: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'businessName'
		},
		logo: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'logo'
		},
		website: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'website'
		},
		corporateCustomer: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'corporateCustomer'
		},
		isCorporate: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0',
			field: 'is_corporate'
		},
		phoneNumber: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'phoneNumber'
		},
		corporatePhoneNumber: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'corporatePhoneNumber'
		},
		nit: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'nit'
		},
		landmark: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'landmark'
		},
		shippingAddress: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'shippingAddress'
		},
		shippingLandmark: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'shippingLandmark'
		},
		shippingCity: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'shippingCity'
		},
		shippingState: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'shippingState'
		},
		shippingPincode: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'shippingPincode'
		},
		country: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'country'
		},
		emailVerifiedAt: {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'email_verified_at'
		},
		password: {
			type: DataTypes.STRING(191),
			allowNull: true,
			field: 'password'
		},
		passwordLastChanged: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: sequelize.fn('current_timestamp'),
			field: 'password_last_changed'
		},
		userType: {
			type: DataTypes.ENUM('Admin','Customer','Supplier'),
			allowNull: false,
			defaultValue: 'Customer',
			field: 'user_type'
		},
		membershipId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'membership_id'
		},
		membershipPurchasedDate: {
			type: DataTypes.DATEONLY,
			allowNull: true,
			field: 'membership_purchased_date'
		},
		freeTrialEndDate: {
			type: DataTypes.DATEONLY,
			allowNull: true,
			field: 'free_trial_end_date'
		},
		verificationCode: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'verificationCode'
		},
		deviceToken: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'device_token'
		},
		deviceType: {
			type: DataTypes.ENUM('IOS','ANDROID'),
			allowNull: true,
			field: 'device_type'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'created_at'
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'updated_at'
		},
		accountStatus: {
			type: DataTypes.ENUM('Active','Inactive'),
			allowNull: false,
			defaultValue: 'Active',
			field: 'account_status'
		}
	}, {
		tableName: 'users'
	});
};
