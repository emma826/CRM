const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    first_name : {
        type : String,
        required : true,
    },
    last_name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
    },
}, {
    collection : "User",
    timeStamp : true
})

const model = mongoose.model("userSchema", userSchema)

module.exports = model