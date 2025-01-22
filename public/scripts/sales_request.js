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
                data.message.forEach(customer => {
                    columns_id.innerHTML = `<li id='${customer.id}' draggable="true">
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

columns.forEach(column => {
    column.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    column.addEventListener('drop', async (e) => {
        e.preventDefault();
        const customerId = e.dataTransfer.getData('text/plain');
        const newStatus = column.id;

        const response = await fetch(`/sales/update_customer_status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: customerId, status: newStatus })
        });

        if (response.ok) {
            const customerElement = document.getElementById(customerId);
            column.appendChild(customerElement);
        } else {
            console.error('Failed to update customer status');
        }
    });
});

document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'li') {
        e.dataTransfer.setData('text/plain', e.target.id);
    }
});