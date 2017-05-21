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
        this.myApp.get('/api/v1/user/me', this.user.auth, this.user.me)
        this.myApp.get('/', (req, res)=>{
            res.json({test: 'test'})
        })
        this.myApp.route('/api/v1/user/:username')
            .get(this.user.auth, this.user.get)
            .patch(this.user.auth, this.user.patch)
            .delete(this.user.auth, this.user.delete)
    }

    blogRoute(){
        this.myApp.get('/api/v1/blogs', blog.getAll)
    }

}