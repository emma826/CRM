const success = document.querySelector(".success")
const error = document.querySelector(".error")
const add_contact = document.querySelector(".add_contact")
const fileInput = document.getElementById("profile_img");
const img = document.querySelector(".profile_img_show");
const customer_container = document.querySelector(".customers")
let customers = [];

const updateCustomerList = (customerList) => {
	let reverse_customer_list = customerList.reverse()
	customer_container.innerHTML = "";
	reverse_customer_list.forEach(customer => {
		const date = new Date(customer.date_added);
		customer_container.innerHTML += `<tr>
											<td>
												<a href="/customers/customer_details/${customer._id}">${customer.name}</a>
											</td>
											<td>${customer.phone_number}</td>
											<td>${customer.email}</td>
											<td>${customer.gender}</td>
											<td>${customer.category}</td>
											<td>${customer.company}</td>
											<td>${date.toDateString()}</td>
										</tr>`;
	});
};

const loadCustomers = async () => {
	await fetch("/customers/load_contact")
		.then(res => res.json())
		.then(data => {
			if (data.success) {
				customersProxy.push(...data.message);
			}
		})
		.catch(err => console.log(err));
};

fileInput.addEventListener('change', function () {
	const file = fileInput.files[0];
	if (file) {
		const reader = new FileReader();

		reader.onload = function (e) {
			img.style.backgroundImage = `url(${e.target.result})`
		};

		reader.readAsDataURL(file);
	}
	else {
		img.style.backgroundImage = `url(/images/upload.png)`
	}
});

add_contact.addEventListener("click", async () => {
	const profile = document.querySelector("#profile_img").files[0]
	const name = document.getElementById("name").value
	const email = document.getElementById("email").value
	const dob = document.getElementById("dob").value
	const gender = document.getElementById("gender").value
	const country_code = document.getElementById("country_code").value
	let telephone = document.getElementById("telephone").value
	const physical_address = document.getElementById("physical_address").value
	const company = document.getElementById("company").value
	const job_title = document.getElementById("job_title").value
	const category = document.getElementById("category").value

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
	formData.append("name", name.trim());
	formData.append("email", email.trim());
	formData.append("dob", dob.trim());
	formData.append("gender", gender.trim());
	formData.append("country_code", country_code.trim());
	formData.append("telephone", telephone.trim());
	formData.append("physical_address", physical_address.trim());
	formData.append("company", company.trim());
	formData.append("job_title", job_title.trim());

	var params = {
		body: formData,
		method: "POST"
	}

	if(!category) {
		error.style.display = "block"
		success.style.display = "none"
		error.innerHTML = "Select a category"

		setTimeout(() => {
			error.style.display = "none"
		}, 3000);

		return;
	}

	await fetch(`/customers/add_customers/${category}`, params)
		.then(res => res.json())
		.then(data => {
			if (data.success) {
				error.style.display = "none"
				success.style.display = "block"
				success.innerHTML = "New contact added successful"

				customersProxy.push(data.message);

				setTimeout(() => {
					success.style.display = "none"
				}, 3000);
			}
			else {
				error.style.display = "block"
				success.style.display = "none"
				error.innerHTML = data.message

				setTimeout(() => {
					error.style.display = "none"
				}, 3000);
			}
		})
		.catch(err => console.log(err))

})

const customersProxy = new Proxy(customers, {
	set: function (target, property, value, receiver) {
		target[property] = value;
		if (property === "length") {
			const event = new CustomEvent("customersUpdated", { detail: target });
			document.dispatchEvent(event);
		}
		return true;
	}
});

document.addEventListener("customersUpdated", (e) => {
	console.log("Customers array updated:", e.detail);
	updateCustomerList(e.detail);
});

window.addEventListener("load", loadCustomers);