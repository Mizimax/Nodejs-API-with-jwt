import { Blog } from '../models/blog.model'

export default class BlogController{
    getAll(req, res){
        Blog.find({},'topic content pic created_by created_at',(err, data)=>{
            if(err) res.status(400).json({error:err})
            else    res.status(200).json(data)
        })
    }
    get(req, res){
        Blog.findOne({ name: req.params.name },'topic content pic created_by comments created_at',(err, data)=>{
            if(err) res.status(400).json({error:err})
            else
                if(!data)
                    res.status(404).json({ error: "Topic Not Found"})
                else
                    res.status(200).json(data)
        })
    }
    create(req, res){
        if(req.decoded.status === 9){
            let newBlog = new Blog({
                name: req.body.name,
                topic: req.body.topic,
                content: req.body.content,
                pic: req.body.pic,
                created_by: req.decoded.name
            })
            newBlog.save(function(err) {
                if (err){
                    if(err.errors)
                        res.status(400).json({error: err.errors})
                    else
                        res.status(400).json({error: err})
                }else{
                    res.status(201).json({data: newBlog, message: "Topic is created"})      
                }
            })
        }else{
            res.status(403).json({ error: "Cannot Access"})
        }
    }
    patch(req, res){
       if(req.decoded.status === 9){
        Blog.findOne({ name: req.params.name },'topic content pic updated_at', (err, data)=>{
                if(err) res.status(400).json({error:err})
                else{
                    if(!data)
                        res.status(404).json({ error: "Topic Not Found"})
                    else{
                        if(req.decoded.name === data.created_by){
                            data.topic = req.body.topic || data.topic
                            data.content = req.body.content || data.content
                            data.pic = req.body.pic || data.pic
                            data.updated_at = Date.now
                            data.save((err)=>{
                                if(err) res.status(400).json({error:err})
                                else    res.status(200).json({ message: "Update Success", data: user})
                            })
                        }else{
                            res.status(403).json({ error: "Cannot Access"})
                        }
                    }
                }
        })
       }else{
            res.status(403).json({ error: "Cannot Access"})
       }
    }
    delete(req, res){
       if(req.decoded.status === 9){
        Blog.findOne({ name: req.params.name },'topic content pic updated_at', (err, data)=>{
                if(err) res.status(400).json({error:err})
                else{
                    if(!data)
                        res.status(404).json({ error: "Topic Not Found"})
                    else{
                        if(req.decoded.name === data.created_by){
                            data.remove()
                            res.status(200).json({message: "Delete Success"})
                        }else{
                            res.status(403).json({ error: "Cannot Access"})
                        }
                    }
                }
        })
       }else{
            res.status(403).json({ error: "Cannot Access"})
       }
    }
}