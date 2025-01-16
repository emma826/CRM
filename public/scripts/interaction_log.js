const interaction_container = document.querySelector(".interaction_container")
const create_interaction = document.querySelector(".create_interaction")
const success = document.querySelector(".success")
const error = document.querySelector(".error")

create_interaction.addEventListener("click", async () => {
	const interaction_subject = document.querySelector("#interaction_subject").value
	const interaction_type = document.querySelector("#interaction_type").value
	const follow_up = document.querySelector("#follow_up_date").value

	var params = {
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ interaction_subject, interaction_type, follow_up }),
		method: "POST"
	}

	await fetch("/interactions/create_interaction", params)
		.then(res => res.json())
		.then(data => {
			if(data.success) {
				error.style.display = "none"
				success.style.display = "block"
				success.innerHTML = "New contact added successful"

				window.location = `/interactions/execute_interaction/${data.success}`

				setTimeout(() => {
					success.style.display = "none"
				}, 3000);
			}
			else {
				error.style.display = "block"
				success.style.display = "none"
				error.innerHTML = data.errors

				setTimeout(() => {
					error.style.display = "none"
				}, 3000);
			}
		})
		.catch(err => console.log(err))
})

const get_interactions = async () => {
	await fetch("/interactions/get_interactions")
		.then(res => res.json())
		.then(data => {
			interaction_container.innerHTML = ""

			if (data.success) {
				data.success.forEach(interaction => {
					const date = new Date(interaction.date).toDateString()
					let follow_up = ""
					if (interaction.follow_up) {
						follow_up = interaction.follow_up
					}
					interaction_container.innerHTML += `<tr>
															<td>${interaction.interaction_type}</td>
															<td>${date}</td>
															<td>${interaction.subject}</td>
															<td>${follow_up}</td>
															<td><a href="/interactions/execute_interaction/${interaction._id}" class="btn btn-secondary">Go</a></td>
														</tr>`
				});
			}

		})
		.catch(err => console.log(err))
}

window.addEventListener("load", () => {
	get_interactions()
})