const mongoose = require("mongoose")

const interactionSchema = mongoose.Schema({
    user_id : {
        type : String,
        required : true
    },
    customer_id : {
        type : Array,
    },
    interaction_id : {
        type : String
    },
    interaction_type : {
        type : String,
        required : true
    },
    date : {
        type : Number,
        required : true
    },
    subject : {
        type : String
    },
    follow_up : {
        type : Number
    }
}, {
    collection : "Interaction",
	timeStamp : true
})

const model = mongoose.model("InteractionSchema", interactionSchema)

module.exports = model