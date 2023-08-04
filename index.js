const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const transporter = nodemailer.createTransport({
    service: 'Your_Email_Service',
    auth: {
        user: 'your_email@example.com',
        pass: 'your_email_password',
    },
});

app.post('/sendEmail', upload.single('attachment'), (req, res) => {
    const { to, subject, text } = req.body;

    const mailOptions = {
        from: 'your_email@example.com',
        to: to,
        subject: subject,
        text: text,
        attachments: [
            {
                filename: req.file.originalname,
                content: req.file.buffer,
            },
        ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent:', info.response);
            res.status(200).send('Email sent successfully');
        }
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running correctly' });
});

const port = 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
