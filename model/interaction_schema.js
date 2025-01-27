const mongoose = require("mongoose")

const interactionSchema = mongoose.Schema({
    user_id : {
        type : String,
        required : true
    },
    interactionName: {
        type: String,
        required: true
    },
    interactionType: {
        type: String,
        required: true
    },
    interactionScheduleType: {
        type: String,
        required: true
    },
    scheduledTime: {
        type: Date,
    },
    recurringDetails: {
        type: {
            type: {
                type: String,
                required: false
            },
            date: {
                type: String,
                required: true
            },
            time: {
                type: String,
                required: true
            }
        }
    },
    interactionContent: {
        type: String,
        required: true
    },
    selectedCustomers: {
        type: [String],
        required: true
    }
}, {
    collection : "Interaction",
	timeStamp : true
})

const model = mongoose.model("InteractionSchema", interactionSchema)

module.exports = model