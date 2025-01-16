const mongoose = require("mongoose")

const schedule_schema = mongoose.Schema({
    user_id: {
        required: true,
        type: String
    },
    customer_id: {
        required : true,
        type : String
    },
    message: {
        required : true,
        type : String
    },
    schedule_date: {
        required : true,
        type : Number
    },
    date: {
        required: true,
        type: Number
    }
}, {
    collection : "Schedule",
	timeStamp : true
})

const model = mongoose.model("scheduleSchema", schedule_schema)

module.exports = model