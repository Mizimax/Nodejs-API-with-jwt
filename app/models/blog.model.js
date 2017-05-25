import mongoose from 'mongoose'

const Schema = mongoose.Schema

var comments = new Schema({
    comment: { type: String, required: [true, 'Comment Required'] },
    created_by: { type:String, default: "Anonymous" },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

var BlogModel = new Schema({
    name: { type: String, required: [true, 'Topic Name Required'] },
    topic: { type: String, required: [true, 'Topic Required']},
    content: { type: String, required: [true, 'Content Required'] },
    pic: { type: String, default: "imgs/blog/default.png" },
    created_by: { type:String, default: "Anonymous" },
    comments: [comments],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
})

BlogModel.index({"name":1})

export const Blog = mongoose.model('Blog', BlogModel)
