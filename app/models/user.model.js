import mongoose from 'mongoose'
import uniqueValidator  from 'mongoose-unique-validator'

const Schema = mongoose.Schema

var UserModel = new Schema({
    username: { 
        type: String, 
        minlength: [6, 'Username must contain at least 6 characters'],
        validate: {
            validator: function(v){
                return /^[a-z0-9]+$/.test(v)
            },
            message: 'Username must only contain lowercase characters or number'
        },
        required: [true, 'Username Required'] 
    },
    password: { 
        type: String,
        min: [6, 'Password must contain at least 6 characters'],
        validate: {
            validator: function(v){
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/.test(v)
            },
            message: 'Password must contain uppercase, lowercase characters and number'
        },
        required: [true, 'Password Required']
    },
    email: { 
        type: String,
        validate: {
            validator: function(v){
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v)
            },
            message: 'Invalid email address'
        },
        required: [true, 'Email Required'] 
    },
    name: { 
        type: String, 
        index: true, 
        required: [true, 'Name Required']
    },
    status: {
        type: Number,
        default: 0
    },
    tokens: [
        {
            access:{type:String, required: true},
            token:{type:String, required: true}
        }
    ]
})
UserModel.index({"username":1}, { "unique": true })
UserModel.index({"email":1}, { "unique": true })

UserModel.plugin(uniqueValidator)

export const User = mongoose.model('User', UserModel)
