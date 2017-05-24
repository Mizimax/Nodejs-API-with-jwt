import UserController from './controllers/user.controller'
import BlogController from './controllers/blog.controller'

export default class Route{
    constructor(app){
        this.app = app
        this.user = new UserController()
        this.blog = new BlogController()
    }
    userRoute(){
        this.app.route('/api/v1/users')
            .post(this.user.regis)
            .get(this.user.auth,this.user.getAll)
        this.app.post('/api/v1/user/login', this.user.login)
        this.app.get('/api/v1/user/me', this.user.auth, this.user.me)
        this.app.get('/', (req, res)=>{
            res.json({test: 'test'})
        })
        this.app.route('/api/v1/user/:username')
            .get(this.user.auth, this.user.get)
            .patch(this.user.auth, this.user.patch)
            .delete(this.user.auth, this.user.delete)
    }

    blogRoute(){
        this.app.get('/api/v1/blogs', this.blog.getAll)
    }

}