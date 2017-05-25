import { User } from '../models/user.model'
import { config } from '../mongo.config'
import jwt from 'jsonwebtoken'

export default class UserController{
    me(req, res){
        User.findOne({ username: req.decoded.username }, 'username name email status', (err, user)=>{
            if(err) res.status(400).json({error:err})
            else    res.status(200).json(user)
        })
    }
    getAll(req, res){
        User.find({},'username name email status',(err, user)=>{
            if(err) res.status(400).json({error:err})
            else    res.status(200).json(user)
        })
    }
    get(req, res){
        User.findOne({ username: req.params.username },'username name email status',(err, user)=>{
            if(err) res.status(400).json({error:err})
            else{
                if(!user)
                    res.status(404).json({ error: "User Not Found"})
                else
                    res.status(200).json(user)
            }
        })
    }
    patch(req, res){
        User.findOne({ username: req.params.username },'username name email password', (err, user)=>{
                if(err) res.status(400).json({error:err})
                else{
                    if(!user)
                        res.status(404).json({ error: "User Not Found"})
                    else{
                        if(req.decoded.status === 9 || req.decoded.username === user.username){
                            user.username = req.body.username || user.username
                            user.password = req.body.password || user.password
                            user.email = req.body.email || user.email
                            user.name = req.body.name || user.name
                            user.save((err)=>{
                                if(err) res.status(400).json({error:err})
                                else    res.status(200).json({ message: "User Updated", user: user})
                            })
                        }else{
                            res.status(403).json({ error: "Cannot Access"})
                        }
                    }
                }
        })
    }
    delete(req, res){
        User.findOne({ username: req.params.username }, (err, user)=>{
            if(err) res.status(400).json({error:err})
            else{
                if(!user)
                    res.status(404).json({ error: "User Not Found"})
                else{
                    if(req.decoded.status === 9 || req.decoded.username === user.username){
                        user.remove()
                        res.status(200).json({user: user, message: "User Deleted"})  
                    }else{
                        res.status(403).json({ error: "Cannot Access"})
                    }
                }
            }
    })
    }
    regis(req, res){
        let newUser = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            name: req.body.name,
            status: 0
        });
        newUser.save(function(err) {
            if (err){
                if(err.errors)
                    res.status(400).json({error: err.errors})
                else
                    res.status(400).json({error: err})
            }else{
                res.status(201).json({user: newUser, message: "Signup Success"})      
            }
        })
    }
    login(req, res){
        User.findOne({ username: req.body.username },'username password name status tokens',(err, user)=>{
            if(err) res.status(400).json({error:err})
            else{
                if(!user)
                    res.status(404).json({ error: "User Not Found"})
                else if(user.password != req.body.password)
                    res.status(400).json({ error: "Wrong Password"})
                else{
                    let access = 'auth'
                    let token = jwt.sign({_id: user._id.toHexString(), username: user.username, name: user.name, status: user.status, access}, config.secret,{
                        expiresIn : 60*60
                    }).toString()
                    res.json({ message: "Login Success", user: user.username, token: token })
                }
            }
        })
    }
}