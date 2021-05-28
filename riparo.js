// Model : sequelize-auto -h localhost -d riparo -u root --dialect mysql -c server/config/config.json -o server/models -t ,pricing_by_cat_sub, -C

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var fileUpload = require("express-fileupload");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var nodemailer = require("nodemailer");
var expressValidator = require("express-validator");
var cors = require("cors");

var app = express();
var http = require("http").createServer(app);

// Constants
const constants = require("./constants");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(expressValidator());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// handling cors
app.use(cors());

require("./routes/routes")(app);

const root = require("path").join(__dirname, "../build");
app.use(express.static(root));
app.get("/healthcheck", (req, res) => {
  res.status(200).send("OK");
});

/*app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../build/index.html'));
});*/
/*
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});*/

module.exports = app;
http.listen(constants.PORT, () =>
  console.log(`app listening on port ${constants.PORT}!`)
);
