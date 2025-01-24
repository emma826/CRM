const express = require("express")
const router = express.Router()
const path = require("path")
const { get_user_details, get_interactions_details, get_customers, get_customer_details } = require("./middleware")
const interactions = require("../model/interaction_schema")
const body_parser = require("body-parser")
const { customer, category_model } = require("../model/customers_schema")
const noteSchema = require("../model/noteSchema")
const email_schema = require("../model/email_schema")
const schedule_schema = require("../model/schedule_schema")

router.use(get_user_details)
router.use(body_parser.json())

const send_notes = async (customers, note, user_id) => {
	const date = new Date()
	try {
		await customers.forEach(async customer_id => {
			if (customer_id != null) {
				await noteSchema.create({ user_id, customer_id, note, date: date.getTime() })
			}
		})
		return {
			message: "Notes sent successfully",
			status: 200
		}
	} catch (error) {
		return {
			message: "Server error, try again later",
			status: 500
		}
	}
}

const send_email = async (customer_ids, customer_names, user_id, from_email, subject, body) => {
	let date = new Date()
	date = date.getTime()

	try {

		for (let i = 0; i < customer_ids.length; i++) {
			if (customer_ids[i] != null) {
				await email_schema.create({ user_id, customer_id: customer_ids[i], name: customer_names[i], from_email, subject, body, date })
			}
		}

		return {
			message: "Email sent successfully",
			status: 200
		}
	} catch (error) {
		console.log(error)
		return {
			message: "Server error, try again later",
			status: 500
		}
	}
}

const send_schedule = async (user_id, customer_ids, message, schedule_date) => {
	let date = new Date()
	date = date.getTime()

	try {

		await customer_ids.forEach(async customer_id => {
			if (customer_id != null) {
				await schedule_schema.create({ user_id, customer_id, message, schedule_date, date })
			}
		})

		return {
			message: "Schedule set successfully",
			status: 200
		}
	} catch (error) {
		console.log(error)
		return {
			message: "Server error, try again later",
			status: 500
		}
	}
}

router.post("/create_interaction", async (req, res) => {
	const { id } = req.user
	const { interaction_subject, interaction_type, follow_up } = req.body

	if (!id) {
		return res.status(400).json({ errors: "Session not found, please login to fix issue" })
	}
	else if (!interaction_subject || !interaction_type) {
		return res.status(400).json({ errors: "Empty fields, please fill in the blank spaces" })
	}
	else {
		let date = new Date()
		date = date.getTime()

		const follow_up_mod = new Date(follow_up)

		try {

			const create_interaction = await interactions.create({ user_id: id, interaction_type, date, subject: interaction_subject, follow_up: follow_up_mod.getTime() })

			return res.status(200).json({
				success: create_interaction.id
			})
		} catch (error) {
			console.error(error)
			return res.status(500).json({ errors: "Server error, please try again later" })
		}
	}
})

router.post("/get_customer_details", async (req, res) => {
	const { customer_id } = req.body
	const { id } = req.user

	if (!id || !customer_id) {
		return res.status(400).json({ errors: "Session not found, try logging in to fix issue" })
	}
	else {
		const customer_details = await get_customer_details(id, customer_id)

		if (customer_details.message == "contact") {
			return res.status(200).json({ success: customer_details.data })
		}
		else {
			return res.status(customer_details.status).json({ error: customer_details.message })
		}
	}
})

router.post("/send_schedule", async (req, res) => {
	const { schedule_date, body, customer_name_container, customer_container, interaction_id } = req.body
	const { id } = req.user

	if (!id) {
		return res.status(500).json({ errors: "Session not found, try logging in to fix issue" })
	}
	else if (!schedule_date || !body || !customer_container || customer_container == [] || !customer_name_container || customer_name_container == []) {
		return res.status(400).json({ errors: "Empty fields, please fill in the blank spaces" })
	}
	else {
		const update_interactions = await interactions.updateOne({ _id: interaction_id }, {
			$set: [
				{ customer_id: customer_container }
			]
		})

		let date = new Date(schedule_date)
		date = date.getTime()

		const schedule = await send_schedule(id, customer_container, body, date)

		if (schedule.status == 200) {
			return res.status(200).json({ success: schedule.message })
		}
		else {
			return res.status(500).json({ errors: schedule.message })
		}
	}
})

router.post("/send_emails", async (req, res) => {
	const { subject, body, customer_name_container, customer_container, interaction_id } = req.body
	const { id, email } = req.user

	if (!id) {
		return res.status(500).json({ errors: "Session not found, try logging in to fix issue" })
	}
	else if (!subject || !body || !customer_container || customer_container == [] || !customer_name_container || customer_name_container == []) {
		return res.status(400).json({ errors: "Empty fields, please fill in the blank spaces" })
	}
	else {
		try {
			const update_interactions = await interactions.updateOne({ _id: interaction_id }, {
				$set: [
					{ customer_id: customer_container }
				]
			})

			const mails = await send_email(customer_container, customer_name_container, id, email, subject, body)

			if (mails.status == 200) {
				return res.status(200).json({ success: mails.message })
			}
			else {
				return res.status(500).json({ errors: mails.message })
			}

		} catch (error) {
			console.log(error)
			return res.status(500).json({ errors: "Server error, please try again later" })
		}
	}
})

router.post("/send_notes", async (req, res) => {
	const { customer_name_container, customer_container, note_text, interaction_id } = req.body
	const { id } = req.user

	if (!id) {
		return res.status(500).json({ errors: "Session not found, try logging in to fix issue" })
	}
	else if (!note_text || !customer_container || customer_container == [] || !customer_name_container || customer_name_container == []) {
		return res.status(400).json({ errors: "Empty fields, please fill in the blank spaces" })
	}
	else {
		try {
			const update_interactions = await interactions.updateOne({ _id: interaction_id }, {
				$set: [
					{ customer_id: customer_container }
				]
			})

			const notes = await send_notes(customer_container, note_text, id)

			if (notes.status == 200) {
				return res.status(200).json({ success: notes.message })
			}
			else {
				return res.status(notes.status).json({ errors: notes.message })
			}

		} catch (error) {
			console.log(error)
			return res.status(500).json({ errors: "Server error, please try again later" })
		}
	}
})

router.get("/", async (req, res) => {
	const url = path.join("interactions", "index")
	const { id, first_name, last_name, email } = req.user

	if (!id) {
		res.redirect("/login")
	}
	else {

		res.render(url, { id, first_name, last_name, email })

	}
})

router.get("/create_interaction", async (req, res) => {
	const url = path.join("interactions", "create_interaction")
	const { id, first_name, last_name, email } = req.user

	if (!id) {
		res.redirect("/login")
	}
	else {
		res.render(url, { id, first_name, last_name, email })
	}
})


router.get("/get_interactions", async (req, res) => {
	const { id } = req.user

	if (!id) {
		return res.status(400).json({ errors: "Session not found, please login to fix issue" })
	}
	else {
		try {

			const get_interactions = await interactions.find({ user_id: id })

			if (!get_interactions[0]) {
				return res.status(201).json({ errors: "No interactions found" })
			}
			else {
				return res.status(200).json({ success: get_interactions.reverse() })
			}

		} catch (error) {
			console.error(error)
		}
	}
})

router.get("/execute_interaction/:interaction_id", async (req, res) => {
	const { interaction_id } = req.params
	const { id, first_name, last_name, email } = req.user
	const url = path.join("interactions", "execute_interactions")

	if (!id) {
		res.redirect("/login")
	}
	else {
		const get_interaction = await get_interactions_details(interaction_id, id)
		const get_customer = await get_customers(id)

		if (!get_interaction) {
			res.redirect("/interactions")
		}
		else {
			res.render(url, { id, first_name, last_name, email, interaction_id, interaction_type: get_interaction.interaction_type, get_interaction, get_customer })
		}
	}
})

module.exports = router