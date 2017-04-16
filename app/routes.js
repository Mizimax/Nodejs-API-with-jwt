import UserController from './controllers/user.controller'

export default class Route{
    constructor(app){
        this.myApp = app
        this.user = new UserController()
    }
    userRoute(){
        this.myApp.route('/api/v1/users')
            .post(this.user.regis)
            .get(this.user.auth,this.user.getAll)
        this.myApp.post('/api/v1/user/login', this.user.login)
        this.myApp.get('/api/v1/user/:username', this.user.auth, this.user.get)
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

    blogRoute(){
        this.myApp.get('/api/v1/blogs', blog.getAll)
    }

}