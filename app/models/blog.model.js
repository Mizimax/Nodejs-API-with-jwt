import mongoose from 'mongoose'

const Schema = mongoose.Schema

var comments = new Schema({
    comment: { type: String, required: [true, 'Topic Required'] },
    created_by: { type:String, default: "ผู้ไม่ประสงค์ออกนาม" },
    created_at: { type: Date, default: Date.now },
    updated_at: Date
});

var BlogModel = new Schema({
    name: { type: String, required: [true, 'Topic Name Required'] },
    topic: { type: String, required: [true, 'Topic Required']},
    content: { type: String, required: [true, 'Content Required'] },
    pic: String,
    created_by: { type:String, default: "Maxang" },
    comments: [comments],
    created_at: { type: Date, default: Date.now },
    updated_at: Date
})

export const Blog = mongoose.model('Blog', BlogModel)
