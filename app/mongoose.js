import mongoose  from 'mongoose'

export default function dbConnect(database){
    var db = mongoose.connect(database); // connect to database
    //return db
}