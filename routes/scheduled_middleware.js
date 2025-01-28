const nodemailer = require('nodemailer');
const env = require('dotenv').config();
const interaction_schema = require('../model/interaction_schema');
const user = require('../model/user_schema');
const {customer} = require('../model/customers_schema'); // Renamed to avoid conflict

const get_user_details = async (user_id) => {
    const find_user = await user.findById({ _id: user_id });
    return find_user;
}

const send_scheduled_email = async (interaction) => {
    const sender = await get_user_details(interaction.user_id);

    interaction.selectedCustomers.forEach(async (customer_id) => {
        const customer_details = await customer.findById({ _id: customer_id }); // Use the renamed model

        const mailOptions = {
            from: sender.email,
            to: customer_details.email,
            subject: interaction.interactionName,
            text: interaction.interactionContent
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        });

        try {
            const info = await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error(error)
        }
        
    });

}

module.exports = {
    send_scheduled_email
}