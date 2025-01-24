const fileInput = document.getElementById("lead_magnet")
let lead_image;
const image_container = document.getElementById("image_container")
const textAd = document.getElementById("text_ad");
const textCont = document.getElementById("textcont");
const lead_image_magnet = document.getElementById("lead_image_magnet")
const create_lead_button = document.querySelector("create_lead_button")
const error = document.getElementById("error")
const success = document.getElementById("success")

fileInput.addEventListener('change', function () {
	const file = fileInput.files[0];
	if (file) {
		const reader = new FileReader();

		reader.onload = function (e) {
            lead_image = e.target.result;
            image_container.innerHTML = `<img src="${e.target.result}" class="img-fluid d-block w-100"/>`
            lead_image_magnet.style.backgroundImage = `url(${e.target.result})`
		};

		reader.readAsDataURL(file);
	}
	else {
		image_container.innerHTML = `<i class="material-icons d-block m-auto" style="font-size: 60px;">
                                        upload
                                    </i>
                                    <h3 class="text-center">Create A Project</h3>`
        lead_image_magnet.style.backgroundImage = null
        lead_image = null
	}
});

textAd.addEventListener("input", (e) => {
    textCont.innerHTML = e.target.value;
});

create_lead_button.addEventListener("click", () => {
    const lead_name = document.getElementById("lead_name").value
    const text_ad = document.getElementById("text_ad").value
    const category = document.getElementById("category").value

    const formData = new FormData()
    formData.append("name", lead_name)
    formData.append("ad", text_ad)
    formData.append("category", category)
    formData.append("lead_magnet", lead_image)

    var params = {
        body : formData,
        method: "POST"
    }

    fetch("/customers/create_lead", params)
        .then(res => res.json())
        .then(data => {
            if(data.success){

                error.style.display = "none"
                success.style.display = "block"

                error.innerHTML = data.message

            }
            else {
                success.style.display = "none"
                error.style.display = "block"

                error.innerHTML = data.message
            }
        })
        .catch(err => console.log(err))
})