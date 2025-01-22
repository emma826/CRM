const express = require("express")
const app = express()
const port = process.env.PORT || 5001

const path = require("path")
const mongoose = require("mongoose")
const cookie_parser = require("cookie-parser")
const body_parser = require('body-parser')
const { get_dashboard, get_user_details } = require('./routes/middleware')

mongoose.connect('mongodb://0.0.0.0:27017/final_year_project')

const sales = require('./routes/sales')
const interactions = require("./routes/interactions")
const customers = require("./routes/customers")
const auth = require("./routes/auth")

app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, 'public')))

app.use(cookie_parser())
app.use(body_parser.json())

app.use('/sales', sales)
app.use("/interactions", interactions)
app.use('/customers', customers)
app.use("/auth", auth)

app.get("/", get_user_details, async (req, res) => {
	const { id, first_name, last_name, email } = req.user

	if (!id) {
		res.redirect("/login")
	}
	else {
		const dashboard = await get_dashboard(id)
		res.render('index', { id, first_name, last_name, email, dashboard })
	}
})

app.get("/login", (req, res) => {
	res.render("login")
})

app.get("/register", (req, res) => {
	res.render("register")
})

app.listen(port, () => console.log(`127.0.0.1:${port}`))