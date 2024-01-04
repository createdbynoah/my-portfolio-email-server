const express = require('express');
const sgMail = require('@sendgrid/mail');
const app = express();
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/api/send-email', (req, res) => {
    const { email, name, message } = req.body;

    const date = new Date();
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    const time = date.toLocaleString('default', { hour: 'numeric', minute: 'numeric' });

    const msg = {
        to: 'noah@createdbynoah.com', // Change to your email
        from: 'portfolio@createdbynoah.com',
        replyTo: email,
        subject: `New Portfolio Contact Form from ${name}`,
        templateId: process.env.SENDGRID_TEMPLATE_ID,
        dynamic_template_data: {
            name,
            email,
            message,
            month,
            day,
            year,
            time,
        },
    };

    sgMail
        .send(msg)
        .then(() => {
            res.status(200).send('Email sent');
        })
        .catch((error) => {
            console.error('Error sending email',error);
            res.status(500).send('Email failed to send');
        });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`)); 