const columns = document.querySelectorAll('.taskList')

const getCustomers = async (status) => {
    let customer_status;
    const columns_id = document.getElementById(status)

    if (status == 'completed') {
        customer_status = 'customer'
    }
    else if (status == 'inprogress') {
        customer_status = 'inprogress'
    }
    else {
        customer_status = 'lead'
    }

    var params = {
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: customer_status }),
        method: 'POST'
    }

    fetch("/sales/get_customer_by_status", params)
        .then(res => res.json())
        .then(data => {
            
            columns_id.innerHTML = ""
            if(data.success) {
                const customer_details = data.message.reverse()
                customer_details.forEach(customer => {
                    columns_id.innerHTML += `<li id='${customer.id}' draggable="true">
                                            <div class="kanban-box">

                                                <div class="kanban-detail">
                                                    <h5 class="mt-0"><a href="" class="text-dark">${customer.name}</a> </h5>
                                                    <ul class="list-inline">
                                                        <li class="list-inline-item">
                                                            <a href="/customers/${customer.id}" data-bs-toggle="tooltip" data-bs-placement="top"
                                                                title="Username">
                                                                <img src="/images/upload.png" alt="img"
                                                                    class="avatar-sm rounded-circle">
                                                            </a>
                                                        </li>
                                                        <li class="list-inline-item">
                                                            <a href="mailto:${customer.email}" data-bs-toggle="tooltip" data-bs-placement="top">
                                                                ${customer.email}
                                                            </a>
                                                        </li>
                                                        <li class="list-inline-item">
                                                            <a href="/customers/${customer.id}" data-bs-toggle="tooltip" data-bs-placement="top">
                                                                <i class="mdi mdi-comment-outline"></i>
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </li>`
                })
                
            }
        })

}

['upcoming', 'inprogress', 'completed'].forEach(async status => {
    await getCustomers(status)
});