import { User } from '../models/user.model'
import jwt from 'jsonwebtoken'
import { config } from '../mongo.config'

export default class UserController{
    auth(req, res, next){
        var token = req.body.token || req.query.token || req.headers['x-access-token']
        if (token) {
            jwt.verify(token, config.secret, function(err, decoded) {      
                if (err) {
                    return res.json({ error: 'Failed to authenticate or token expired.' });   
                } else {
                    req.decoded = decoded    
                    next();
                }
            });
        } else {
            return res.status(403).send({ 
                error: 'Can Not Access, Please Login' 
            })
            
        }
    }
    getAll(req, res){
        User.find({},'username name email status',(err, user)=>{
            if(err) res.status(400).json(err)
            else res.json(user)
        })
    }
    get(req, res, next){
        User.findOne({ username: req.params.username },'username name email status',(err, user)=>{
            if(err) res.status(400).json(err)
            else{
                if(!user)
                    res.status(404).json({ error: "Not Found"})
                else
                    res.json(user)
            }
        })
    }
    regis(req, res, next){
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
                    res.status(400).json({error: err.errors})
                else
                    res.status(400).json({error: err})
            }else{
                res.json({user: newUser, message: "Signup Success"})      
            }
        })
    }
    login(req, res){
        User.findOne({ username: req.body.username },'username password status tokens',(err, user)=>{
            if(err) res.status(400).json(err)
            else{
                if(!user)
                    res.status(404).json({ error: "User Not Found"})
                else if(user.password != req.body.password)
                    res.status(400).json({ error: "Wrong Password"})
                else{
                    let access = 'auth'
                    let token = jwt.sign({_id: user._id.toHexString(), username: user.username, status: user.status, access}, config.secret,{
                        expiresIn : 60*60
                    }).toString()
                    res.json({ message: "Login Success", token: token })
                }
            }
        })
    }
    logout(req, res){
        res.send('user con')
    }
}