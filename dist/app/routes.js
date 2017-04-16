'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _user = require('./controllers/user.controller');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Route = function () {
    function Route(app) {
        _classCallCheck(this, Route);

        this.myApp = app;
        this.user = new _user2.default();
    }

    _createClass(Route, [{
        key: 'userRoute',
        value: function userRoute() {
            this.myApp.route('/api/v1/users').post(this.user.regis).get(this.user.auth, this.user.getAll);
            this.myApp.post('/api/v1/user/login', this.user.login);
            this.myApp.get('/api/v1/user/:username', this.user.auth, this.user.get);
            // this.myApp.get('/', function(req, res){
            //     res.sendFile('index.html',{ root: __dirname+'/public/' })
            // })
            // this.myApp.get('/reg', function(req, res){
            //     res.sendFile('reg.html',{ root: __dirname+'/public/' })
            // })
            // this.myApp.get('/login', function(req, res){
            //     res.sendFile('login.html',{ root: __dirname+'/public/' })
            // })
        }
    }, {
        key: 'blogRoute',
        value: function blogRoute() {
            this.myApp.get('/api/v1/blogs', blog.getAll);
        }
    }]);

    return Route;
}();

exports.default = Route;