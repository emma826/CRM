const select_customer = document.querySelectorAll(".select_customer")
const add_customer_button = document.querySelector(".add_customer_button")
let customer_count = document.getElementById("customer_count")
let customer_holder = []
const add_category = document.getElementById('add_category')
const error = document.querySelector('.error')
const success = document.querySelector('.success')

add_customer_button.addEventListener("click", () => {
    select_customer.forEach(customer => {
        if (customer.checked) {
            customer_holder.push(customer.value)
        }
    })

    console.log(customer_holder)

    customer_count.textContent = `${customer_holder.length} customer${customer_holder.length > 1 ? 's' : ''} added`
})

document.getElementById('interaction_schedule_type').addEventListener('change', function () {
    var oneTimeSchedule = document.getElementById('one_time_schedule');
    var recurringSchedule = document.getElementById('recurring_schedule');
    if (this.value === 'one_time') {
        oneTimeSchedule.style.display = 'block';
        recurringSchedule.style.display = 'none';
    } else if (this.value === 'recurring') {
        oneTimeSchedule.style.display = 'none';
        recurringSchedule.style.display = 'block';
    } else {
        oneTimeSchedule.style.display = 'none';
        recurringSchedule.style.display = 'none';
    }
});

add_category.addEventListener('click', function() {
    var interactionName = document.getElementById('interaction_name').value;
    var interactionType = document.getElementById('interaction_type').value;
    var interactionScheduleType = document.getElementById('interaction_schedule_type').value;
    var scheduledTime = document.getElementById('scheduled_time').value;
    var recurringType = document.getElementById('recurring_type').value;
    var interactionContent = document.getElementById('interaction_content').value;

    var recurringDetails = {};
    if (interactionScheduleType === 'recurring') {
        if (recurringType === 'daily') {
            recurringDetails = {
                type: 'daily',
                time: document.getElementById('recurring_time').value
            };
        } else if (recurringType === 'weekly') {
            recurringDetails = {
                type: 'weekly',
                day: document.getElementById('recurring_day').value,
                time: document.getElementById('recurring_time').value
            };
        } else if (recurringType === 'monthly') {
            recurringDetails = {
                type: 'monthly',
                date: document.getElementById('recurring_date').value,
                time: document.getElementById('recurring_time').value
            };
        } else if (recurringType === 'yearly') {
            recurringDetails = {
                type: 'yearly',
                date: document.getElementById('recurring_date').value,
                time: document.getElementById('recurring_time').value
            };
        }
    }

    var selectedCustomers = [];
    document.querySelectorAll('.select_customer:checked').forEach(function(checkbox) {
        selectedCustomers.push(checkbox.value);
    });

    var data = {
        interactionName: interactionName,
        interactionType: interactionType,
        interactionScheduleType: interactionScheduleType,
        scheduledTime: interactionScheduleType === 'one_time' ? scheduledTime : null,
        recurringDetails: interactionScheduleType === 'recurring' ? recurringDetails : null,
        interactionContent: interactionContent,
        selectedCustomers: selectedCustomers
    };

    fetch('/interactions/create_interaction', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            success.style.display = 'block'
            error.style.display = 'none'

            success.textContent = "Interaction created successfully"

            setTimeout(() => {
                success.style.display = 'none'
            }, 3000)
            
        }
        else{
            error.style.display = 'block'
            success.style.display = 'none'

            error.textContent = data.message

            setTimeout(() => {
                error.style.display = 'none'
            }, 3000)
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});