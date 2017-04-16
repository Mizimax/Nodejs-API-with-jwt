'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.User = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var UserModel = new Schema({
    username: { type: String, required: [true, 'Username Required'] },
    password: { type: String, required: [true, 'Password Required'] },
    email: { type: String, required: [true, 'Email Required'] },
    name: { type: String, index: true, required: [true, 'Name Required'] },
    status: Number,
    tokens: [{ access: { type: String, required: true }, token: { type: String, required: true } }]
});
UserModel.index({ "username": 1 }, { "unique": true });
UserModel.index({ "email": 1 }, { "unique": true });

var User = exports.User = _mongoose2.default.model('User', UserModel);