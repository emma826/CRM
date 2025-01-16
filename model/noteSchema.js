const mongoose = require("mongoose")

const interactionSchema = mongoose.Schema({
    user_id : {
        type : String,
        required : true
    },
    customer_id : {
        type : String,
        required : true
    },
    note : {
        type : String,
        required : true
    },
    date : {
        type : Number,
        required : true
    }
}, {
    collection : "Note",
	timeStamp : true
})

const model = mongoose.model("NoteSchema", interactionSchema)

module.exports = model