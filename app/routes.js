import UserController from './controllers/user.controller'
import {ArticleController, CommentController} from './controllers/blog.controller'
import AuthController from './controllers/auth.controller'

export default class Route{
    constructor(app){
        this.app = app
        this.user = new UserController()
        this.article = new ArticleController()
        this.comment = new CommentController()
        this.auth = new AuthController()
    }
    userRoute(){
        this.app.route('/api/v1/users')
            .post(this.user.regis)
            .get(this.auth.decode,this.user.getAll)
        this.app.post('/api/v1/user/login', this.user.login)
        this.app.get('/api/v1/user/me', this.auth.decode, this.user.me)
        this.app.route('/api/v1/user/:username')
            .get(this.auth.decode, this.user.get)
            .patch(this.auth.decode, this.user.patch)
            .delete(this.auth.decode, this.user.delete)
    }

    blogRoute(){
        /* Article */
        this.app.route('/api/v1/blogs')
                .post(this.auth.decode, this.article.create)
                .get(this.article.getAll)
        this.app.route('/api/v1/blog/:name')
                .get(this.article.get)
                .patch(this.auth.decode, this.article.patch)
                .delete(this.auth.decode, this.article.delete)
        /* Comment */
        this.app.route('/api/v1/blog/:name/comments')
                .post(this.comment.create)
                .get(this.comment.getAll)
        this.app.route('/api/v1/blog/:name/comment/:id')
                .patch(this.auth.decode, this.comment.patch)
                .delete(this.auth.decode, this.comment.delete)
    }


}