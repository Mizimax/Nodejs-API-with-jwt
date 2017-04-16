import mongoose from 'mongoose'

const Schema = mongoose.Schema

var UserModel = new Schema({
    username: { type: String, required: [true, 'Username Required'] },
    password: { type: String, required: [true, 'Password Required']},
    email: { type: String, required: [true, 'Email Required'] },
    name: { type: String, index: true, required: [true, 'Name Required']},
    status: Number,
    tokens: [{access:{type:String, required: true},token:{type:String, required: true}}]
})
UserModel.index({"username":1}, { "unique": true })
UserModel.index({"email":1}, { "unique": true })

export const User = mongoose.model('User', UserModel)
