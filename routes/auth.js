const express = require("express")
const router = express.Router()

const body_parser = require("body-parser")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const cookie_parser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const env = require("dotenv").config()
const user = require("../model/user_schema")

mongoose.connect("mongodb://0.0.0.0:27017/final_year_project")
router.use(body_parser.json())
router.use(cookie_parser())

router.post("/register", async (req, res) => {
	const { first_name, last_name, email, password, confirm_password } = req.body

	if (!first_name || !last_name || !email || !password) {
		return res.status(422).json({
			errors: "Please fill in the empty fields"
		})
	}
	else if (password.length < 8) {
		return res.status(422).json({
			errors: "Passwords must be up to 8 characters"
		})
	}
	else if (password !== confirm_password) {
		return res.status(422).json({
			errors: "Your passwords do not match"
		})
	}
	else {

		try {
			const password_hash = await bcrypt.hash(password, 10)

			const create_user = await user.create({ first_name, last_name, email, password: password_hash })

			const token = jwt.sign(create_user.id, process.env.SECRET_KEY)
			res.cookie("final_year_project", token, {
				maxAge: 3600 * 24 * 1000,
				httpOnly: true,
				secure: process.env.NODE_ENV === "production"
			  });
			  

			return res.status(200).json({
				success: "Signup successful, redirecting ..."
			})

		} catch (error) {
			if (error.code == 11000) {
				return res.status(422).json({
					errors: "Email already exists in the database, try logging in"
				})
			}
			else {
				console.log(error)
				return res.status(500).json({
					errors: "Server error, please try again later"
				})
			}
		}
	}

})

router.post("/login", async (req, res) => {
	const { email, password } = req.body

	if (!email) {
		return res.status(422).json({
			errors: "Empty fields, please input your email address"
		})
	}
	else {
		try {

			const findUser = await user.findOne({ email })

			if (findUser.id) {

				const compare_password = await bcrypt.compare(password, findUser.password)

				if (compare_password == true) {
					const token = jwt.sign(findUser.id, process.env.SECRET_KEY)
					await res.cookie("final_year_project", token, {
						maxAge: 3600 * 24 * 1000, 
						httpOnly: true,
						secure: process.env.NODE_ENV === "production"
					  });
					  
	
	
					return res.status(200).json({
						success: "/main"
					})
				}
				else {
					return res.status(400).json({
						errors: "Invalid Email/Password"
					})
				}

			}
			else {
				return res.status(422).json({
					errors: "Account doesn't exist, signup to create account"
				})
			}

		} catch (error) {
			console.log(error)
			return res.status(500).json({
				errors: "Server error, don't worry we are working to fix the issue"
			})
		}
	}
})

router.get("/logout", async (req, res) => {
	res.clearCookie('final_year_project');
	res.redirect("/login")
})


module.exports = router