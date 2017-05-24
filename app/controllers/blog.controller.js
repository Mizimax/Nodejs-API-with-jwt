import { Blog } from '../models/blog.model'

export default class BlogController{
    getAll(req, res){
        Blog.find({},'username name email status',(err, user)=>{
            if(err) res.status(400).json({error:err})
            else res.json(user)
        })
    }
}