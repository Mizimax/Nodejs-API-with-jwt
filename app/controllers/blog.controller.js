import { Blog } from '../models/blog.model'
import https from 'https'

export class ArticleController{

    getAll(req, res){
        Blog.find({ topic: { $regex: req.query.search || '' }, category: req.query.category || /./ },'name topic pic created_by created_at',{ sort: req.query.sort, skip: Number(req.query.offset), limit: Number(req.query.limit)},(err, data)=>{
            if(err) res.status(400).json({error:err})
            else    res.status(200).json(data)
        })
    }

    count(req, res){
        Blog.find({ topic: { $regex: req.query.search || '' }, category: { $all: [req.query.category] } }).count((err,count)=>{
            if(err) res.status(400).json({error:err})
            else    res.status(200).json({num: count})
        })
    }

    get(req, res){
        Blog.findOne({ name: req.params.name },'topic content pic created_by created_at updated_at',(err, data)=>{
            if(err) res.status(400).json({error:err})
            else
                if(!data)
                    res.status(404).json({ error: "Article Not Found"})
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
                        res.status(400).json({error: err})
                }else{
                    res.status(201).json({data: newBlog, message: "Article is created"})      
                }
            })
        }else{
            res.status(403).json({ error: "Cannot Access"})
        }
    }

    patch(req, res){
        Blog.findOne({ name: req.params.name },'topic content pic updated_at', (err, data)=>{
                if(err) res.status(400).json({error:err})
                else{
                    if(!data)
                        res.status(404).json({ error: "Article Not Found"})
                    else{
                        if(req.decoded.status === 9 || req.decoded.name === data.created_by){
                            data.topic = req.body.topic || data.topic
                            data.content = req.body.content || data.content
                            data.pic = req.body.pic || data.pic
                            data.updated_at = Date.now()
                            data.save((err)=>{
                                if(err) res.status(400).json({error:err})
                                else    res.status(200).json({ message: "Article Updated", data: data})
                            })
                        }else{
                            res.status(403).json({ error: "Cannot Access"})
                        }
                    }
                }
        })
    }

    delete(req, res){
        Blog.findOne({ name: req.params.name },'topic content pic updated_at', (err, data)=>{
                if(err) res.status(400).json({error:err})
                else{
                    if(!data)
                        res.status(404).json({ error: "Article Not Found"})
                    else{
                        if(req.decoded.status === 9 || req.decoded.name === data.created_by){
                            data.remove()
                            res.status(200).json({message: "Article Deleted"})
                        }else{
                            res.status(403).json({ error: "Cannot Access"})
                        }
                    }
                }
        })
    }
}

export class CommentController{

    captcha(req, res){
        https.get("https://www.google.com/recaptcha/api/siteverify?secret=6LfxASUUAAAAACTTQGDkkVyihUGmjzEZjuLsqBWZ&response=" + req.body.captcha
            , function(res) {
                var data = "";
                res.on('data', function (chunk) {
                        data += chunk.toString();
                });
                res.on('end', function() {
                        try {
                                var parsedData = JSON.parse(data);
                                res.json(parsedData)
                        } catch (e) {
                                res.status(400).json(e)
                        }
                });
            }
        )
    }

    getAll(req, res){
        Blog.findOne({ name: req.params.name },'comments',(err, data)=>{
            if(err) res.status(400).json({error:err})
            else    res.status(200).json(data.comments)
        })
    }

    create(req, res){
        Blog.findOne({ name: req.params.name },'comments', (err, data)=>{
            if(err) res.status(400).json({error:err})
            else{
                if(!data)
                    res.status(404).json({ error: "Article Not Found"})
                else{
                    data.comments.push({
                        comment: req.body.comment,
                        created_by: req.body.created_by
                    })
                    data.save((err)=>{
                        if(err) res.status(400).json({error:err})
                        else    res.status(200).json({ message: "Commented", data: data.comments[data.comments.length - 1]})
                    })
                }
            }
        })
    }

    patch(req, res){
        Blog.findOne({ name: req.params.name },'comments created_by', (err, data)=>{
                if(err) res.status(400).json({error:err})
                else{
                    if(!data)
                        res.status(404).json({ error: "Article Not Found"})
                    else{
                        let myComment = data.comments.id(req.params.id)
                        if(req.decoded.status === 9 || req.decoded.name === myComment.created_by){
                            myComment.comment = req.body.comment || myComment.comment
                            myComment.updated_at = Date.now()
                            data.save((err)=>{
                                if(err) res.status(400).json({error:err})
                                else    res.status(200).json({ message: "Comment Updated", data: myComment})
                            })
                        }else{
                            res.status(403).json({ error: "Cannot Access"})
                        }
                    }
                }
        })
    }

    delete(req, res){
       Blog.findOne({ name: req.params.name },'comments created_by', (err, data)=>{
                if(err) res.status(400).json({error:err})
                else{
                    if(!data)
                        res.status(404).json({ error: "Article Not Found"})
                    else{
                        let myComment = data.comments.id(req.params.id)
                        if(req.decoded.status === 9 || req.decoded.name === myComment.created_by){
                            myComment.remove()
                            data.save((err)=>{
                                if(err) res.status(400).json({error:err})
                                else    res.status(200).json({ message: "Comment Deleted", data: myComment})
                            })
                        }else{
                            res.status(403).json({ error: "Cannot Access"})
                        }
                    }
                }
        })
    }
}