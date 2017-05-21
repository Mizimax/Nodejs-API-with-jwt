import { User } from '../models/user.model'
import jwt from 'jsonwebtoken'
import { config } from '../mongo.config'

/* ERROR STATUS CODE */
/*
    199x = cannot acccess
    199y = auth failed
    299z = user not found
    399x = dup
    399y = required
    555z = wrong pass
    999z = Unknown
*/

export default class UserController{
    auth(req, res, next){
        var token = req.body.token || req.query.token || req.headers['x-access-token']
        if (token) {
            jwt.verify(token, config.secret, function(err, decoded) {      
                if (err) {
                    res.status(400).json({ error: 'Failed to authenticate or token expired.', code: '199y', err: err });   
                } else {
                    req.decoded = decoded    
                    next();
                }
            });
        } else {
            res.status(403).json({ 
                error: 'Cannot Access' , 
                code: '199x'
            })
        }
    }
    me(req, res){
        User.findOne({ username: req.decoded.username }, 'username name email status', (err, user)=>{
            if(err) res.status(400).json({error:err,code: '999z'})
            else    res.json(user)
        })
    }
    getAll(req, res){
        User.find({},'username name email status',(err, user)=>{
            if(err) res.status(400).json({error:err,code: '999z'})
            else res.json(user)
        })
    }
    get(req, res){
        User.findOne({ username: req.params.username },'username name email status',(err, user)=>{
            if(err) res.status(400).json({error:err,code: '999z'})
            else{
                if(!user)
                    res.status(404).json({ error: "User Not Found",code: '299z'})
                else
                    res.json(user)
            }
        })
    }
    patch(req, res){
       User.findOne({ username: req.params.username },'username name email password', (err, user)=>{
            if(err) res.status(400).json({error:err,code: '999z'})
            else{
                if(!user)
                    res.status(404).json({ error: "User Not Found",code: '299z'})
                else{
                    if(req.decoded.username === user.username || req.decoded.status === 9){
                        user.username = req.body.username || user.username
                        user.password = req.body.password || user.password
                        user.email = req.body.email || user.email
                        user.name = req.body.name || user.name
                        user.save((err)=>{
                            if(err) res.status(400).json({error:err,code: '999z'})
                            else    res.json({ message: "Update Success", user: user})
                        })
                    }else{
                        res.status(403).json({ error: "Cannot Access" ,code: '199x'})
                    }
                }
            }
       })
    }
    delete(req, res){
        User.findOne({ username: req.params.username }, (err, user)=>{
            if(err) res.status(400).json({error:err,code: '999z'})
            else{
                if(!user)
                    res.status(404).json({ error: "User Not Found",code: '299z'})
                else{
                    if(req.decoded.username === user.username || req.decoded.status === 9){
                        user.remove()
                        res.json({user: user, message: "Delete Success"})  
                    }else{
                        res.status(403).json({ error: "Cannot Access" ,code: '199x'})
                    }
                }
            }
       })
    }
    regis(req, res){
        var newUser = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            name: req.body.name,
            status: 0
        });
        newUser.save(function(err) {
            if (err){
                if(err.errors)
                    res.status(400).json({error: err.errors,code: '399x'})
                else
                    res.status(400).json({error: err,code: '399y'})
            }else{
                res.json({user: newUser, message: "Signup Success"})      
            }
        })
    }
    login(req, res){
        User.findOne({ username: req.body.username },'username password status tokens',(err, user)=>{
            if(err) res.status(400).json({error:err,code: '999z'})
            else{
                if(!user)
                    res.status(404).json({ error: "User Not Found",code: '299z'})
                else if(user.password != req.body.password)
                    res.status(400).json({ error: "Wrong Password",code: '555z'})
                else{
                    let access = 'auth'
                    let token = jwt.sign({_id: user._id.toHexString(), username: user.username, status: user.status, access}, config.secret,{
                        expiresIn : 60*60
                    }).toString()
                    res.json({ message: "Login Success", user: user.username, token: token })
                }
            }
        })
    }
}