const success = document.querySelector(".success")
const error = document.querySelector(".error")
const add_contact = document.querySelector(".add_contact")
const fileInput = document.getElementById("profile_img");
const img = document.querySelector(".profile_img_show");
const customer = document.querySelector(".customers")

fileInput.addEventListener('change', function () {
	const file = fileInput.files[0];
	if (file) {
		const reader = new FileReader();

		reader.onload = function (e) {
			img.style.backgroundImage = `url(${e.target.result})`
		};

		reader.readAsDataURL(file); // Read the file as a data URL
	}
	else {
		img.style.backgroundImage = `url(/images/upload.png)`
	}
});

add_contact.addEventListener("click", async () => {
	const profile = document.querySelector("#profile_img").files[0]
	const name = document.getElementById("name").value
	const email = document.getElementById("email").value
	const country_code = document.getElementById("country_code").value
	let telephone = document.getElementById("telephone").value
	const company = document.getElementById("company").value

	if (telephone.startsWith("0")) {
		telephone = telephone.slice(1)
	}
	else if (isNaN(telephone)) {
		error.style.display = "block"
		success.style.display = "none"

		error.innerHTML = "Telephone is not a valid number"

		setTimeout(() => {
			error.style.display = "none"
		}, 3000);

		return;
	}

	const formData = new FormData();
	formData.append("profile_image", profile);
	formData.append("name", name);
	formData.append("email", email);
	formData.append("country_code", country_code);
	formData.append("telephone", telephone);
	formData.append("company", company);

	var params = {
		body: formData,
		method: "POST"
	}

	await fetch("/customers/add_contact", params)
		.then(res => res.json())
		.then(data => {
			if (data.success) {
				error.style.display = "none"
				success.style.display = "block"
				success.innerHTML = "New contact added successful"

				load_contact()

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

const load_contact = async () => {
	await fetch("/customers/load_contact").then(res => res.json()).then(data => {
		if (data.success) {
			customer.innerHTML = ""
			data.success.forEach(customers => {
				const date = new Date(customers.date_added)
				customer.innerHTML += `<tr>
											<th scope="row">1</th>
											<td>
												<a href="/customers/customer_details/${customers._id}">${customers.name}</a>
											</td>
											<td>${customers.phone_number}</td>
											<td>${customers.email}</td>
											<td>${customers.company}</td>
											<td>${date.toDateString()}</td>
											<td><input type="checkbox" class="form-check text-center" name="" id=""></td>
										</tr>`
			});

		}
	}).catch(err => console.log(err))
}

window.addEventListener("load", load_contact)