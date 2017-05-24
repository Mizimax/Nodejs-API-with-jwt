import UserController from './controllers/user.controller'
import BlogController from './controllers/blog.controller'
import AuthController from './controllers/auth.controller'

export default class Route{
    constructor(app){
        this.app = app
        this.user = new UserController()
        this.blog = new BlogController()
        this.auth = new AuthController()
    }
    userRoute(){
        this.app.route('/api/v1/users')
            .post(this.user.regis)
            .get(this.auth.decode,this.user.getAll)
        this.app.post('/api/v1/user/login', this.user.login)
        this.app.get('/api/v1/user/me', this.auth.decode, this.user.me)
        this.app.get('/', (req, res)=>{
            res.json({test: 'test'})
        })
        this.app.route('/api/v1/user/:username')
            .get(this.auth.decode, this.user.get)
            .patch(this.auth.decode, this.user.patch)
            .delete(this.auth.decode, this.user.delete)
    }

    blogRoute(){
        this.app.route('/api/v1/blogs')
                .post(this.auth.decode, this.blog.create)
                .get(this.blog.getAll)
        this.app.route('/api/v1/blog/:name')
                .get(this.blog.get)
                .patch(this.auth.decode, this.blog.patch)
                .delete(this.auth.decode, this.blog.delete)
    }

}