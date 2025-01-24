const express = require("express")
const router = express.Router()
const cookie_parser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const env = require("dotenv").config()
const user = require("../model/user_schema")
const { customer, category_model } = require("../model/customers_schema")
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
		const get_interactions = await interaction.findOne({ _id: interaction_id, user_id })

		if (!get_interactions.id) {
			return null
		}
		else {
			return get_interactions
		}
	}
	catch (error) {
		return null
	}
}

const get_category = async (user_id) => {
	try {
		const get_category = await category_model.find({ user_id })
		return {
			success: true,
			message: get_category
		}
	}
	catch (error) {
		console.log(error)
		return {
			message: "Server error, please try again later",
			status: 500,
			success: false
		}
	}
}

const get_dashboard = async (user_id) => {
	try {
		const currentMonth = new Date().getMonth() + 1;
		const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
		const currentYear = new Date().getFullYear();
		const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

		const customersThisMonth = await customer.countDocuments({
			user_id,
			status: "customer",
			date_added: {
				$gte: new Date(currentYear, currentMonth - 1, 1).getTime(),
				$lt: new Date(currentYear, currentMonth, 1).getTime()
			}
		});

		const customersLastMonth = await customer.countDocuments({
			user_id,
			status: "customer",
			date_added: {
				$gte: new Date(lastMonthYear, lastMonth - 1, 1).getTime(),
				$lt: new Date(currentYear, currentMonth - 1, 1).getTime()
			}
		});

		const customerPercentageChange = ((customersThisMonth - customersLastMonth) / (customersLastMonth || 1)) * 100;

		const leadsThisMonth = await customer.countDocuments({
			user_id,
			status: "lead",
			date_added: {
				$gte: new Date(currentYear, currentMonth - 1, 1).getTime(),
				$lt: new Date(currentYear, currentMonth, 1).getTime()
			}
		});

		const leadsLastMonth = await customer.countDocuments({
			user_id,
			status: "lead",
			date_added: {
				$gte: new Date(lastMonthYear, lastMonth - 1, 1).getTime(),
				$lt: new Date(currentYear, currentMonth - 1, 1).getTime()
			}
		});

		const leadsPercentageChange = ((leadsThisMonth - leadsLastMonth) / (leadsLastMonth || 1)) * 100;

		const interactionsThisMonth = await interaction.countDocuments({
			user_id,
			createdAt: {
				$gte: new Date(currentYear, currentMonth - 1, 1),
				$lt: new Date(currentYear, currentMonth, 1)
			}
		});

		const interactionsLastMonth = await interaction.countDocuments({
			user_id,
			createdAt: {
				$gte: new Date(lastMonthYear, lastMonth - 1, 1),
				$lt: new Date(currentYear, currentMonth - 1, 1)
			}
		});

		const interactionPercentageChange = ((interactionsThisMonth - interactionsLastMonth) / (interactionsLastMonth || 1)) * 100;
		const interactionsPerDay = await interaction.aggregate([
			{
				$match: {
					user_id,
					createdAt: {
						$gte: new Date(currentYear, currentMonth - 1, 1),
						$lt: new Date(currentYear, currentMonth, 1)
					}
				}
			},
			{
				$group: {
					_id: { $dayOfMonth: "$createdAt" },
					count: { $sum: 1 }
				}
			},
			{
				$sort: { _id: 1 }
			}
		]);

		const interactionsPerDayData = Array.from({ length: new Date(currentYear, currentMonth, 0).getDate() }, (_, i) => {
			const day = i + 1;
			const interaction = interactionsPerDay.find(interaction => interaction._id === day);
			return {
				day,
				count: interaction ? interaction.count : 0
			};
		});
		
		const leadsPerDay = await customer.aggregate([
			{
				$match: {
					user_id,
					status: "lead",
					date_added: {
						$gte: new Date(currentYear, currentMonth - 1, 1).getTime(),
						$lt: new Date(currentYear, currentMonth, 1).getTime()
					}
				}
			},
			{
				$group: {
					_id: { $dayOfMonth: { $toDate: "$date_added" } },
					count: { $sum: 1 }
				}
			},
			{
				$sort: { _id: 1 }
			}
		]);

		const customersPerDay = await customer.aggregate([
			{
				$match: {
					user_id,
					status: "customer",
					date_added: {
						$gte: new Date(currentYear, currentMonth - 1, 1).getTime(),
						$lt: new Date(currentYear, currentMonth, 1).getTime()
					}
				}
			},
			{
				$group: {
					_id: { $dayOfMonth: { $toDate: "$date_added" } },
					count: { $sum: 1 }
				}
			},
			{
				$sort: { _id: 1 }
			}
		]);

		const conversionData = Array.from({ length: new Date(currentYear, currentMonth, 0).getDate() }, (_, i) => {
			const day = i + 1;
			const lead = leadsPerDay.find(lead => lead._id === day);
			const customer = customersPerDay.find(customer => customer._id === day);
			return {
				day,
				leads: lead ? lead.count : 0,
				customers: customer ? customer.count : 0
			};
		});

		return {
			customerPercentageChange,
			leadsPercentageChange,
			interactionPercentageChange,
			interactionsPerDay: interactionsPerDayData,
			conversionData,
			leadsThisMonth,
			customersThisMonth
		};
		
    } catch (error) {
		console.log(error);
		return {
			message: "Server error, please try again later",
			status: 500
		};
	}
}

const get_category_details = async (user_id, category_id) => {
	try {
		const get_category = await category_model.findOne({ _id: category_id, user_id })

		if (!get_category) {
			return {
				message: "No category found",
				status: 201
			}
		}
		else {
			return {
				message: "category",
				status: 200,
				data: get_category
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

module.exports = { get_dashboard, get_user_details, get_customers, get_customer_details, get_interactions_details, get_dashboard, get_category, get_category_details }