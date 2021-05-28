var jwt = require("jsonwebtoken");
const fun = require("../function/api_fun.js");

var constants = require("../constants");

function verifyToken(req, res, next) {
  var token = req.headers["x-access-token"];
  if (!token) return fun.returnResponse(res, false, 403, "No token provided.");

  jwt.verify(token, constants.API_SECRET, function (err, decoded) {
    if (err)
      return fun.returnResponse(
        res,
        false,
        403,
        "Failed to authenticate token."
      );

    // if everything good, save to request for use in other routes
    req.id = decoded.id;
    next();
  });
}

module.exports = verifyToken;
