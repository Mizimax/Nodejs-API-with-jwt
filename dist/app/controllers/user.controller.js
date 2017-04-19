'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _user = require('../models/user.model');

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _mongo = require('../mongo.config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserController = function () {
    function UserController() {
        _classCallCheck(this, UserController);
    }

    _createClass(UserController, [{
        key: 'auth',
        value: function auth(req, res, next) {
            var token = req.body.token || req.query.token || req.headers['x-access-token'];
            if (token) {
                _jsonwebtoken2.default.verify(token, _mongo.config.secret, function (err, decoded) {
                    if (err) {
                        res.status(400).json({ error: 'Failed to authenticate or token expired.' });
                    } else {
                        req.decoded = decoded;
                        next();
                    }
                });
            } else {
                res.status(403).json({
                    error: 'Cannot Access'
                });
            }
        }
    }, {
        key: 'me',
        value: function me(req, res) {
            _user.User.findOne({ username: req.decoded.username }, 'username name email status', function (err, user) {
                if (err) res.status(400).json(err);else res.json(user);
            });
        }
    }, {
        key: 'getAll',
        value: function getAll(req, res) {
            _user.User.find({}, 'username name email status', function (err, user) {
                if (err) res.status(400).json(err);else res.json(user);
            });
        }
    }, {
        key: 'get',
        value: function get(req, res) {
            _user.User.findOne({ username: req.params.username }, 'username name email status', function (err, user) {
                if (err) res.status(400).json(err);else {
                    if (!user) res.status(404).json({ error: "Not Found" });else res.json(user);
                }
            });
        }
    }, {
        key: 'put',
        value: function put(req, res) {
            _user.User.findOne({ username: req.params.username }, 'username name email password', function (err, user) {
                if (err) res.status(400).json(err);else {
                    if (!user) res.status(404).json({ error: "Not Found" });else {
                        if (req.decoded.username === user.username || req.decoded.status === 9) {
                            user.username = req.body.username || user.username;
                            user.password = req.body.password || user.password;
                            user.email = req.body.email || user.email;
                            user.name = req.body.name || user.name;
                            user.save(function (err) {
                                if (err) res.status(400).json(err);else res.json({ message: "Update Success", user: user });
                            });
                        } else {
                            res.status(403).json({ error: "Cannot Access" });
                        }
                    }
                }
            });
        }
    }, {
        key: 'delete',
        value: function _delete(req, res) {
            _user.User.findOne({ username: req.params.username }, function (err, user) {
                if (err) res.status(400).json(err);else {
                    if (!user) res.status(404).json({ error: "Not Found" });else {
                        if (req.decoded.username === user.username || req.decoded.status === 9) {
                            user.remove();
                            res.json({ user: user, message: "Delete Success" });
                        } else {
                            res.status(403).json({ error: "Cannot Access" });
                        }
                    }
                }
            });
        }
    }, {
        key: 'regis',
        value: function regis(req, res) {
            var newUser = new _user.User({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                name: req.body.name,
                status: 0
            });
            newUser.save(function (err) {
                if (err) {
                    if (err.errors) res.status(400).json({ error: err.errors });else res.status(400).json({ error: err });
                } else {
                    res.json({ user: newUser, message: "Signup Success" });
                }
            });
        }
    }, {
        key: 'login',
        value: function login(req, res) {
            _user.User.findOne({ username: req.body.username }, 'username password status tokens', function (err, user) {
                if (err) res.status(400).json(err);else {
                    if (!user) res.status(404).json({ error: "User Not Found" });else if (user.password != req.body.password) res.status(400).json({ error: "Wrong Password" });else {
                        var access = 'auth';
                        var token = _jsonwebtoken2.default.sign({ _id: user._id.toHexString(), username: user.username, status: user.status, access: access }, _mongo.config.secret, {
                            expiresIn: 60 * 60
                        }).toString();
                        res.json({ message: "Login Success", token: token });
                    }
                }
            });
        }
    }, {
        key: 'logout',
        value: function logout(req, res) {
            res.send('user con');
        }
    }]);

    return UserController;
}();

exports.default = UserController;