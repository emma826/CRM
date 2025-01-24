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
	dob : {
		type : Date
	}, 
	gender: {
		type: String,
		enum: ["male", "female"],
		required: true
	},
	phone_number: {
		type: String
	},
	physical_address: {
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
		type: String
	},
	category: {
		required: true,
		type: String
	},
	date_added: {
		type: Date,
		default: Date.now
	}
}, {
	collection: "Customer",
	timeStamp: true
})

const customer = mongoose.model("customerSchema", customer_schema)

const category_schema = mongoose.Schema({
	user_id: {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true
	}
}, {
	collection: "category",
	timeStamp: true
})

const category = mongoose.model("categorySchema", category_schema)

module.exports = { customer, category_model: category }