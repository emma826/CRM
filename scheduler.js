const cron = require('node-cron');
const mongoose = require('mongoose');
const interactions = require('./model/interaction_schema'); // Corrected path
const { send_scheduled_email } = require('./routes/scheduled_middleware'); // Corrected path

mongoose.connect('mongodb://0.0.0.0:27017/final_year_project');

const task = cron.schedule('* * * * *', async () => {

    const now = new Date();
    const one_time_formattedDate = now.toISOString().slice(0, 16);
    
    try {
        const interactionList = await interactions.find({ task: true });
        interactionList.forEach(interaction => {
            if(interaction.interactionScheduleType === 'one_time') {

                const interaction_formattedDate = new Date(interaction.scheduledTime).toISOString().slice(0, 16);

                if(interaction_formattedDate == one_time_formattedDate) {
                    send_scheduled_email(interaction);
                }

            }

            if(interaction.interactionScheduleType === 'recurring') {
                const recurringDetails = interaction.recurringDetails;
                const recurringTime = recurringDetails.time;
                const [recurringHours, recurringMinutes] = recurringTime.split(':').map(Number);

                if (recurringDetails.type === 'daily') {
                    if (recurringHours === now.getHours() && recurringMinutes === now.getMinutes()) {
                        send_scheduled_email(interaction);
                    }
                }

                if (recurringDetails.type === 'weekly') {
                    const recurringDay = recurringDetails.date;
                    if (recurringHours === now.getHours() && recurringMinutes === now.getMinutes() && recurringDay === now.getDay()) {
                        send_scheduled_email(interaction);
                    }
                }

                if (recurringDetails.type === 'monthly') {
                    const recurringDate = recurringDetails.date;
                    if (recurringHours === now.getHours() && recurringMinutes === now.getMinutes() && recurringDate === now.getDate()) {
                        send_scheduled_email(interaction);
                    }
                }  
                
                if (recurringDetails.type === 'yearly') {
                    const recurringDate = recurringDetails.date;
                    if (recurringHours === now.getHours() && recurringMinutes === now.getMinutes() && recurringDate === now.getDate() && recurringDetails.month === now.getMonth()) {
                        send_scheduled_email(interaction);
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error executing task:', error);
    }
});

task.start();

module.exports = {
    start: () => console.log('Scheduler started'),
};