const mongoose = require("mongoose")

const customer_schema = mongoose.Schema({
	user_id: {
		required: true,
		type: String
	},
	name: {
		required: true,
		type: String
	},
	phone_number: {
		type: String
	},
	email: {
		required: true,
		type: String
	},
	company: {
		required: true,
		type: String
	},
	profile_image: {
		required: true,
		type: String
	},
	status: {
		required: true,
		type: String,
		default: "lead"
	},
	date_added: {
		required: true,
		type: String
	}
}, {
	collection: "Customer",
	timeStamp: true
})

const customer = mongoose.model("customerSchema", customer_schema)

module.exports = { customer }