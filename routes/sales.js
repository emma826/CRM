const express = require("express")
const router = express.Router()
const path = require("path")
const { get_user_details } = require("./middleware")
const customer_schema = require("../model/customers_schema")

router.use(get_user_details)

router.get("/", async (req, res) => {
	const url = path.join("sales", "index")
	const { id, first_name, last_name, email } = req.user

	if (!id) {
		res.redirect("/login")
	}
	else {
		res.render(url, { id, first_name, last_name, email })
	}

})

router.post("/get_customer_by_status", async (req, res) => {
	const { status } = req.body
	const { id } = req.user

	if (!id) {
		return res.status(400).json({
			success: false,
			message: "Session lost, please login to fix issue"
		})
	}

	try {

		const get_customer = await customer_schema.find({status})

		return res.status(200).json({
			success : true,
			message : get_customer
		})

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Server error, please try again later'
		})
	}
})

module.exports = router