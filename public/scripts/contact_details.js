const upload_notes = document.querySelector("#upload_notes")
const send_email = document.querySelector(".send_email")

send_email.addEventListener("click", async () => {
	const from_email = document.querySelector("#from_email").value
	const to_email = document.querySelector("#to_email").value
	const subject = document.querySelector("#subject").value
	const body = document.querySelector("#body").value

	var params = {
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ from_email: from_email.trim(), to_email: to_email.trim(), subject: subject.trim(), body: body.trim(), contact_id }),
		method: "POST"
	}

	await fetch("/customers/send_mail", params)
		.then(res => res.json())
		.then(data => {
			if (data.success) {
				document.querySelector("#note_text").value = "";
				create_toast("Email sent successfully!", "success")
				get_emails()
			}
			else {
				create_toast(data.errors, "error")
			}
		})
		.catch(err => console.error(err))
})

const get_emails = async () => {
	const email_container = document.querySelector(".email_container")

	var params = {
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ contact_id }),
		method: "POST"
	}

	await fetch("/customers/get_emails", params)
		.then(res => res.json())
		.then(data => {
			if (data.success) {
				email_container.innerHTML = ""
				data.success.forEach(emails => {
					const date_obj = new Date(emails.date)
					const date = date_obj.toLocaleDateString()
					const time = date_obj.toLocaleTimeString()

					email_container.innerHTML += `<div class="card mb-3">
														<div class="card-body">
															<div>
																<div class="float-end">${date} ${time}</div>
																<div class="h5">${full_name}</div>
															</div>
															<hr>
															<p>${emails.subject}</p>
														</div>
													</div>`
				})
			}

		})
		.catch(err => console.error(err))

}

upload_notes.addEventListener("click", async () => {
	let note_text = document.querySelector("#note_text").value

	var params = {
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ note_text, contact_id }),
		method: "POST"
	}

	await fetch("/customers/upload_notes", params)
		.then(res => res.json())
		.then(data => {
			if (data.success) {
				document.querySelector("#note_text").value = "";
				create_toast("Note sent successfully!", "success")
				get_notes()
			}
			else {
				create_toast(data.errors, "error")
			}
		})
		.catch(error => {
			console.log(error)
		})
})

const get_notes = async () => {

	const note_timeline = document.querySelector(".note_timeline")

	var params = {
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ contact_id }),
		method: "POST"
	}

	await fetch("/customers/get_notes", params)
		.then(res => res.json())
		.then(data => {

			if (data.success) {
				note_timeline.innerHTML = ""
				data.success.forEach((note, index) => {
					const date_obj = new Date(note.date)
					const date = date_obj.toLocaleDateString()
					const time = date_obj.toLocaleTimeString()


					if (index % 2 == 0) {
						note_timeline.innerHTML += `<article class="timeline-item alt">
															<div class="timeline-desk">
																<div class="panel">
																	<div class="panel-body">
																		<span class="arrow-alt"></span>
																		<span class="timeline-icon bg-primary"><i class="mdi mdi-circle"></i></span>
																		<h4 class="text-primary mt-0 text-start py-2">${date} ${time}</h4>
																		<p class="text-start">${note.note}</p>
																	</div>
																</div>
															</div>
														</article>`

					}
					else {
						note_timeline.innerHTML += `<article class="timeline-item">
															<div class="timeline-desk">
																<div class="panel">
																	<div class="panel-body">
																		<span class="arrow"></span>
																		<span class="timeline-icon bg-success"><i class="mdi mdi-circle"></i></span>
																		<h4 class="text-success mt-0 text-start py-2">${date} ${time}</h4>
																		<p class="text-start">${note.note}</p>
																	</div>
																</div>
															</div>
														</article>`

					}

				})
			}



		})
		.catch(err => console.log(err))
}

window.addEventListener("load", () => {
	get_notes()
	get_emails()
})

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

// make_call.addEventListener("click", () => {

// })

// const create_element = async () => {
// 	const popupDiv = document.createElement("div");
// 	popupDiv.style.position = "fixed";
// 	popupDiv.style.bottom = "20px";
// 	popupDiv.style.right = "20px";
// 	popupDiv.style.width = "300px";
// 	popupDiv.style.height = "200px";
// 	popupDiv.style.backgroundColor = "#f0f0f0";
// 	popupDiv.style.border = "1px solid #ccc";
// 	popupDiv.style.borderRadius = "10px";
// 	popupDiv.style.padding = "10px";
// 	popupDiv.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
// 	popupDiv.style.display = "none"; // Initially hidden
// 	popupDiv.id = "popupDiv";

// 	const minimizeButton = document.createElement("button");
// 	minimizeButton.textContent = "-";
// 	minimizeButton.style.position = "absolute";
// 	minimizeButton.style.top = "5px";
// 	minimizeButton.style.right = "5px";
// 	minimizeButton.style.border = "none";
// 	minimizeButton.style.background = "none";
// 	minimizeButton.style.cursor = "pointer";
// 	minimizeButton.onclick = function () {
// 		popupDiv.style.height = "20px";
// 		popupDiv.style.overflow = "hidden";
// 	};

// 	const restoreButton = document.createElement("button");
// 	restoreButton.textContent = "+";
// 	restoreButton.style.position = "absolute";
// 	restoreButton.style.top = "5px";
// 	restoreButton.style.right = "25px";
// 	restoreButton.style.border = "none";
// 	restoreButton.style.background = "none";
// 	restoreButton.style.cursor = "pointer";
// 	restoreButton.onclick = function () {
// 		popupDiv.style.height = "200px";
// 	};

// 	popupDiv.appendChild(minimizeButton);
// 	popupDiv.appendChild(restoreButton);
// 	document.body.appendChild(popupDiv);

// 	function togglePopup() {
// 		if (popupDiv.style.display === "none") {
// 			popupDiv.style.display = "block";
// 		} else {
// 			popupDiv.style.display = "none";
// 		}
// 	}
// }
