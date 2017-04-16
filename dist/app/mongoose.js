'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = dbConnect;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function dbConnect(database) {
    var db = _mongoose2.default.connect(database); // connect to database
    //return db
}