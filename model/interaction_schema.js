const mongoose = require("mongoose")

const interactionSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
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
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'yearly'],
        },
        date: {
            type: String,
        },
        time: {
            type: String,
        },
    },
    interactionContent: {
        type: String,
        required: true
    },
    selectedCustomers: {
        type: [String],
        required: true
    },
    task: {
        type: Boolean,
        default: false
    }
}, {
    collection: "Interaction",
    timeStamp: true
})

const model = mongoose.model("InteractionSchema", interactionSchema)

module.exports = model