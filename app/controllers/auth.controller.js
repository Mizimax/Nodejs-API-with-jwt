import jwt from 'jsonwebtoken'
import { config } from '../mongo.config'

export default class AuthController{
    decode(req, res, next){
        var token = req.body.token || req.query.token || req.headers['x-access-token']
        if (token) {
            jwt.verify(token, config.secret, function(err, decoded) {      
                if (err) {
                    res.status(401).json({ error: 'Failed to authenticate or token expired.', err: err });   
                } else {
                    req.decoded = decoded    
                    next();
                }
            });
        } else {
            res.status(403).json({ 
                error: 'Cannot Access'
            })
        }
    }
}