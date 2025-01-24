const express = require("express")
const router = express.Router()
const path = require("path")
const body_parser = require("body-parser")
const fileUpload = require("express-fileupload")
const { get_user_details, get_customers, get_customer_details, get_category, get_category_details } = require("./middleware")
const { customer, category_model } = require("../model/customers_schema")
const notes = require("../model/noteSchema")
const interaction = require("../model/interaction_schema")
const email = require("../model/email_schema")

router.use(get_user_details)
router.use(body_parser.json())
router.use(fileUpload())

router.post("/add_customers/:category", async (req, res) => {
	const category_id = req.params.category
	const { id } = req.user;
	const { name, email, dob, gender, country_code, telephone, physical_address, company, job_title } = req.body;

	if (!name || !email) {
		return res.status(400).json({
			success: false,
			message: "Empty fields, fill in your email and password"
		})
	}

	else if (!id) {
		return res.status(500).json({
			success: false,
			message: "Session not found, try logging in again"
		})
	}

	const category_details = await get_category_details(id, category_id)

	if (category_details.message != "category") {
		return res.status(400).json({
			success: false,
			message: "Category not found, please select a category"
		})
	}

	try {
		let uniqueFilename = null
		const date = new Date()

		if (req.files && Object.keys(req.files).length > 0) {
			const profileImage = req.files.profile_image;
			uniqueFilename = `${Date.now()}_${profileImage.name}`;

			if (profileImage.size > 500000) {
				return res.status(400).json({
					success: false,
					message: "Image is too large for upload, try uploading a smaller image"
				})
			}

			await profileImage.mv(path.join(__dirname, "../public", "uploads", uniqueFilename))
		}

		const category = category_details.data.category

		const create_customer = await customer.create({ user_id: id, name, dob, gender, phone_number: country_code + telephone, physical_address, email, company, profile_image: uniqueFilename, category, date_added: date.getTime() })

		return res.status(200).json({
					success: true,
					message : create_customer
				})

	} catch (error) {
		console.log(error)
		return res.status(500).json({
					success: false,
					message: "Server error, please try again later"
				})
	}

})

router.post("/upload_notes", async (req, res) => {
	const { note_text, contact_id } = req.body
	const { id } = req.user

	if (!id || !contact_id) {
		return res.status(400).json({
			errors: "Session not found, please login to fix issue"
		})
	}
	else if (!note_text) {
		return res.status(401).json({
			errors: "Empty fields, please leave a note"
		})
	}
	else {

		const date = new Date();
		const main_date = date.getTime()

		try {

			const create_note = await notes.create({ user_id: id, customer_id: contact_id, note: note_text, date: main_date })
			await interaction.create({ user_id: id, customer_id: contact_id, interaction_id: create_note._id, interaction_type: "note", date: main_date, subject: note_text })

			return res.status(200).json({
				success: "Note sent successfully"
			})

		} catch (error) {
			console.log(error)
			return res.status(500).json({
				errors: "Server error, please try again later"
			})
		}
	}
})

router.post("/get_notes", async (req, res) => {
	const { id } = req.user
	const { contact_id } = req.body

	if (!id || !contact_id) {
		return res.status(500).json({
			errors: "Session not found, login to fix issue"
		})
	}

	try {
		const get_notes = await notes.find({ user_id: id, customer_id: contact_id })

		if (!get_notes[0]) {
			return res.status(200).json({
				errors: "No notes yet, leave a note for your customer"
			})
		}
		else {
			return res.status(200).json({
				success: get_notes.reverse()
			})
		}

	} catch (error) {
		return res.status(500).json({
			errors: "Server error, login to fix issue"
		})
	}
})

router.post("/send_mail", async (req, res) => {
	const { from_email, to_email, subject, body, contact_id } = req.body
	const { id, first_name, last_name } = req.user

	if (!id) {
		return res.status(500).json({
			errors: "Session not found, please login to fix issue"
		})
	}

	if (!from_email || !to_email || !subject || !body) {
		return res.status(400).json({
			errors: "Empty fields, please fill in the necessary details"
		})
	}

	try {
		const date = new Date();
		const main_date = date.getTime()

		const create_email = await email.create({ user_id: id, customer_id: contact_id, name: `${first_name} ${last_name}`, from_email, to_email, subject, body, date: main_date })
		await interaction.create({ user_id: id, customer_id: contact_id, interaction_id: create_email._id, interaction_type: "email", date: main_date, subject })

		return res.status(200).json({
			success: "Email sent successfully"
		})

	} catch (error) {
		console.log(error)
		return res.status(500).json({
			errors: "Server error, please try again later"
		})
	}
})

router.post("/get_emails", async (req, res) => {
	const { id } = req.user
	const { contact_id } = req.body

	if (!id || !contact_id) {
		return res.status(500).json({
			errors: "Session not found, login to fix issue"
		})
	}

	try {
		const get_emails = await email.find({ user_id: id, customer_id: contact_id })

		if (!get_emails[0]) {
			return res.status(200).json({
				errors: "No notes yet, leave a note for your customer"
			})
		}
		else {
			return res.status(200).json({
				success: get_emails.reverse()
			})
		}

	} catch (error) {
		return res.status(500).json({
			errors: "Server error, login to fix issue"
		})
	}
})

router.post("/add_category", async (req, res) => {
	const { id } = req.user
	const { category } = req.body

	if (!id) {
		return res.status(400).json({
			success: false,
			message: "Session not found, please login to fix issue"
		})
	}

	if (!category) {
		return res.status(400).json({
			success: false,
			message: "Please input a category"
		})
	}

	try {
		const create_category = await category_model.create({ user_id: id, category })
		return res.status(200).json({
			success: true,
			message: create_category
		})
	} catch (error) {
		console.log(error)
		return res.status(500).json({
			success: false,
			message: "Server error, please try again later"
		})
	}
})

router.get("/", async (req, res) => {
	const { id, first_name, last_name, email } = req.user
	const url = path.join("customers", "index")

	if (id) {

		await get_category(id).then((data) => {
			res.render(url, { id, first_name, last_name, email, category: data.message.reverse() })
		})
	}
	else {
		res.redirect("/login")
	}
})

router.get("/load_category", async (req, res) => {
	const { id } = req.user

	if (!id) {
		return res.status(400).json({
			success: false,
			message: "Session not found, please login to fix issue"
		})
	}

	try {

		const get_category = await category_model.find({ user_id: id })

		return res.status(200).json({
			success: true,
			message: get_category
		})

	} catch (error) {
		console.log(error)
		return res.status(500).json({
			success: false,
			message: "Server error, please try again later"
		})
	}
})

router.get("/create_lead", async (req, res) => {
	const { id, first_name, last_name, email } = req.user
	const url = path.join("customers", "create_lead")

	if (id) {
		res.render(url, { id, first_name, last_name, email })
	}
	else {
		res.redirect("/login")
	}
})

router.get("/load_contact", async (req, res) => {
	const { id } = req.user

	if (!id) {
		return res.status(500).json({
			success: false,
			message: "Session not found, try logging in again"
		})
	}
	else {
		const get_customer = await get_customers(id)

		if (get_customer.message == "contact") {
			return res.status(200).json({
				success: true,
				message: get_customer.data
			})
		}
		else {
			return res.status(get_customer.status).json({
				success: false,
				message: get_customer.message
			})
		}
	}
})

router.get("/customer_details/:url", async (req, res) => {
	const url = path.join("customers", "customer_details")
	const { id, first_name, last_name, email } = req.user

	if (id) {
		const get_details = await get_customer_details(id, req.params.url)

		if (get_details.message == "contact") {
			res.render(url, { id, first_name, last_name, email, get_details: get_details.data })
		}
		else {
			res.redirect("/customers")
		}

	}
	else {
		res.redirect("/login")
	}
})


module.exports = router