const express = require("express")
const router = express.Router()
const path = require("path")
const { get_user_details } = require("./middleware")

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

module.exports = router