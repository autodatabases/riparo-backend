"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const constants = require("../constants");

const db = {};

const sequelize = new Sequelize(
  constants.DB_NAME,
  constants.DB_USER,
  constants.DB_PASSWORD,
  {
    host: constants.DB_HOST,
    dialect: constants.DB_DIALECT,
    operatorsAliases: constants.DB_OPERATOR_ALIASES,
  }
);

sequelize.sync();

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
