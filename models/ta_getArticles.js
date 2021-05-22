/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('taGetArticles', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		carId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			field: 'carId'
		},
		dataSupplierId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			field: 'dataSupplierId'
		},
		articleNumber: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'articleNumber'
		},
		mfrId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			field: 'mfrId'
		},
		mfrName: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'mfrName'
		},
		misc: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'misc'
		},
		genericArticles: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'genericArticles'
		},
		gtins: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'gtins'
		},
		tradeNumbers: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'tradeNumbers'
		},
		oemNumbers: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'oemNumbers'
		},
		replacesArticles: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'replacesArticles'
		},
		replacedByArticles: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'replacedByArticles'
		},
		linkages: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'linkages'
		},
		pdfs: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'pdfs'
		},
		images: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'images'
		},
		links: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'links'
		},
		totalLinkages: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'totalLinkages'
		},
		prices: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'prices'
		},
		dataSupplierFacets: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'dataSupplierFacets'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'created_at'
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'updated_at'
		}
	}, {
		tableName: 'ta_getArticles',
		timestamps : false
	});
};
