const mongoose = require("mongoose")

const emailSchema = mongoose.Schema({
	user_id : {
		required : true,
		type : String
	},
	customer_id : {
		required : true,
		type : String
	},
	name : {
		required : true,
		type : String
	},
	from_email : {
		required : true,
		type : String
	},
	to_email : {
		type : String
	},
	subject : {
		required : true,
		type : String
	},
	body : {
		required : true,
		type : String
	},
	date : {
		required : true,
		type : Number
	},
},{
	collection : "Email",
	timeStamp : true
})

const model = mongoose.model("emailSchema", emailSchema)

module.exports = model