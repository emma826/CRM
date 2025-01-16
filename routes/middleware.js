const express = require("express")
const router = express.Router()
const cookie_parser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const env = require("dotenv").config()
const user = require("../model/user_schema")
const customer = require("../model/customers_schema")
const interaction = require("../model/interaction_schema")

router.use(cookie_parser())

async function get_user_details(req, res, next) {
	const { final_year_project } = req.cookies

	try {

		const verify_id = await jwt.verify(final_year_project, process.env.SECRET_KEY)
		const find_user = await user.findById({ _id: verify_id })

		if (!find_user) {
			req.user = {
				id: null
			}
			next()
		}
		else {
			req.user = {
				id: find_user.id,
				first_name: find_user.first_name,
				last_name: find_user.last_name,
				email: find_user.email
			}
			next()
		}

	} catch (error) {
		console.log(error)
		req.user = {
			id: null
		}
		next()
	}
}

const get_customers = async (user_id) => {
	try {
		const get_customers = await customer.find({ user_id })
		if (!get_customers[0]) {
			return {
				message: " No contact added",
				status: 201
			}
		}
		else {
			return {
				message: "contact",
				status: 200,
				data: get_customers
			}
		}
	} catch (error) {
		console.log(error)
		return {
			message: "Server error, please try again later",
			status: 500
		}
	}
}

const get_customer_details = async (user_id, customer_id) => {
	try {
		const get_customers = await customer.findOne({ _id: customer_id, user_id })
		if (!get_customers) {
			return {
				message: "No customer found",
				status: 201
			}
		}
		else {
			return {
				message: "contact",
				status: 200,
				data: get_customers
			}
		}
	} catch (error) {
		console.log(error)
		return {
			message: "Server error, please try again later",
			status: 500
		}
	}
}

const get_interactions_details = async (interaction_id, user_id) => {
	try {
		const get_interactions = await interaction.findOne({_id : interaction_id, user_id})

		if(!get_interactions.id) {
			return null
		}
		else {
			return get_interactions
		}
	}
	catch(error) {
		return null
	}
}

module.exports = { get_user_details, get_customers, get_customer_details, get_interactions_details }