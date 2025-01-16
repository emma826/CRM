const signup = document.querySelector(".sign_up")
const success = document.querySelector(".success")
const error = document.querySelector(".error")

signup.addEventListener("click", async () => {
	const first_name = document.querySelector("#first_name").value
	const last_name = document.querySelector("#last_name").value
	const email = document.querySelector("#email").value
	const password = document.querySelector("#password").value
	const confirm_password = document.querySelector("#confirm_password").value
	const terms_condition = document.querySelector("#checkbox_signup").checked

	var params = {
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ first_name, last_name, email, password, confirm_password }),
		method: "POST"
	}

	if (terms_condition == false || !terms_condition) {
		error.style.display = "block"
		success.style.display = "none"

		error.innerHTML = "Agree to the terms and condition before proceeding"
		setTimeout(() => {
			error.style.display = "none"
		}, 3000);
	}
	else {
		await fetch("/auth/register", params)
			.then(res => res.json())
			.then(data => {
				if (data.success) {
					error.style.display = "none"
					success.style.display = "block"
					success.innerHTML = "Signup successful, redirecting ..."

					window.location = "/"

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
			.catch(err => console.log)
	}
})
