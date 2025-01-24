const add_category = document.getElementById('add_category');

add_category.addEventListener('click', () => {
    const category = document.getElementById('category').value;

    const params = {
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ category: category }),
        method: 'POST'
    }

    fetch("/customers/add_category", params)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const category = data.message;
                create_toast("category added successfully", 'success');

                const category_table = document.querySelector('.category_table');
                category_table.insertAdjacentHTML('afterbegin', `<tr>
                                                                    <td>${category.category}</td>
                                                                    <td>http://127.0.0.1:5000/add_customers/${category._id}</td>
                                                                </tr>`);
            }
            else {
                create_toast(data.message, 'error');
            }
        })
        .catch(error => {
            console.log(error);
        })
})

window.addEventListener('load', () => {
    fetch("/customers/load_category")
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const category_table = document.querySelector('.category_table');
                data.message.forEach(category => {
                    category_table.insertAdjacentHTML('afterbegin', `<tr>
                                                                        <td>${category.category}</td>
                                                                        <td>http://127.0.0.1:5000/add_customers/${category._id}</td>
                                                                    </tr>`);
                })
            }
        })
        .catch(error => console.error(error))
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