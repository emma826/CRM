const customer_btn = document.querySelector("#customer_btn")
const select_all = document.querySelector(".select_all")
const customers = document.querySelectorAll(".customers")
let customer_container;
let customer_name_container = []
const execute_interaction = document.querySelector("#execute_interaction")

execute_interaction.addEventListener("click", async () => {
	const interaction_type = document.querySelector("#interaction_type").value

	switch (interaction_type) {
		case "note":
			send_notes()
			break;
	
		case "email":
			send_email()
			break;
		
		case "schedule":
			send_schedule()
			break;
		
		default:
			break;
	}
})

const send_schedule = async () => {
	const schedule_date = document.querySelector("#schedule_date").value
	const body = document.querySelector("#body").value

	var params = {
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ schedule_date,  body, customer_name_container, customer_container, interaction_id }),
		method: "POST"
	}

	await fetch("/interactions/send_schedule", params)
		.then(res => res.json())
		.then(data => {

			if (data.success) {
				create_toast("Schedule set successfully", "success")
			}
			else {
				create_toast(data.errors, "error")
			}

		})
		.catch(err => console.log(err))
}

const send_email = async () => {
	const subject = document.querySelector("#subject").value;
	const body = document.querySelector("#body").value;

	var params = {
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ subject, body, customer_name_container, customer_container, interaction_id }),
		method: "POST"
	}

	await fetch("/interactions/send_emails", params)
		.then(res => res.json())
		.then(data => {

			if (data.success) {
				create_toast("Email sent successfully", "success")
			}
			else {
				create_toast(data.errors, "error")
			}

		})
		.catch(err => console.log(err))
}

const send_notes = async () => {
	const note_text = document.querySelector("#note_text").value

	var params = {
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ customer_name_container, customer_container, note_text, interaction_id }),
		method: "POST"
	}

	await fetch("/interactions/send_notes", params)
		.then(res => res.json())
		.then(data => {

			if (data.success) {
				create_toast("Notes sent successfully", "success")
			}
			else {
				create_toast(data.errors, "error")
			}

		})
		.catch(err => console.log(err))
}

customer_btn.addEventListener("click", async () => {
	customer_container = null

	customer_container = Array.from(customers)
		.filter(checkbox => checkbox.checked)
		.map(checkbox => checkbox.value);

	get_customer_names(customer_container)

})

select_all.addEventListener("change", async () => {
	customers.forEach(checkbox => {
		checkbox.checked = select_all.checked;
	});
})

customers.forEach(checkbox => {
	checkbox.addEventListener('change', () => {
		select_all.checked = Array.from(customers).every(c => c.checked);
	});
})

const get_customer_names = async (customer_ids) => {
	const customer_container = document.querySelector(".customer_container")
	const customer_count = document.querySelector(".customer_count")

	customer_container.innerHTML = ""

	if (select_all.checked == true) {
		customer_count.innerHTML = `${customer_ids.length - 1} customer(s) added`
	}
	else {
		customer_count.innerHTML = `${customer_ids.length} customer(s) added`
	}

	customer_ids.forEach(async customer_id => {
		if (customer_id) {
			var params = {
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ customer_id }),
				method: "POST"
			}

			await fetch("/interactions/get_customer_details", params)
				.then(res => res.json())
				.then(data => {
					let profile_img = "/images/3.png"
					customer_name_container.push(data.success.name)
					if (data.success) {

						if (data.success.profile_image != "null") {
							profile_img = `/uploads/${data.success.profile_image}`
						}

						customer_container.innerHTML += `<div class="col-3">
														<div class="card px-2 pt-2 mx-1">
															<div class="mx-auto"
																style="background-image: url(${profile_img}); width: 60px; height: 60px; background-size: cover; background-position: center; border-radius: 50%;">
															</div>
															<p class="text-center fw-bold text-dark">${data.success.name}</p>
														</div>
													</div>`
					}
				})
				.catch(err => console.log(err))
		}
	})
}

const create_toast = (message, type) => {
	const toast = document.createElement("div");
	toast.style.position = "fixed";
	toast.style.top = "80px";
	toast.style.right = "20px";
	toast.style.backgroundColor = type === "success" ? "green" : "red";
	toast.style.color = "white";
	toast.style.padding = "10px";
	toast.style.borderRadius = "5px";
	toast.style.zIndex = "1000";
	document.body.appendChild(toast);

	toast.innerHTML = message;

	setTimeout(() => {
		document.body.removeChild(toast);
	}, 3000);
}