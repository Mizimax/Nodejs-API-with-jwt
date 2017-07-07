import mongoose from 'mongoose'
import uniqueValidator  from 'mongoose-unique-validator'

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
    sub_title: { type: String, required: [true, 'Subtitle Required']},
    content: { type: String, required: [true, 'Content Required'] },
    category: { type: [String], required: [true, 'Category Required'] },
    pic: { type: String, default: "default.png" },
    created_by: { type: String, default: "Anonymous" },
    comments: [comments],
    description: String,
    tags: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
})

BlogModel.index({"name":1}, { "unique": true })

BlogModel.plugin(uniqueValidator)

export const Blog = mongoose.model('Blog', BlogModel)
