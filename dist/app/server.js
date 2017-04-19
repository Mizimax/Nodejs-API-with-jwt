'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _mongo = require('./mongo.config');

var _mongoose = require('./mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var Mongoose = (0, _mongoose2.default)(_mongo.config.database);
var app = (0, _express2.default)();
var port = Number(process.env.PORT || 8080);

var route = new _routes2.default(app);

app.set('superSecret', _mongo.config.secret); // secret variable

if (process.env.NODE_ENV == 'developemnt') app.use((0, _morgan2.default)('dev')); // Development will have logs
else app.use((0, _compression2.default)()); // Production will compress file

app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({
  extended: true
}));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
route.userRoute();

app.listen(port, function () {
  console.log('Listening at ' + port);
});