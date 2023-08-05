const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const XLSX = require('xlsx');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Function to convert 2D array to Excel file
function createExcelFile(data, fileName) {
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return { buffer: excelBuffer, name: fileName };
}




app.post('/sendEmail', upload.single('attachment'), (req, res) => {
    // const { to, subject, text } = req.body;
    // console.log(req);
    console.log("request recieved : ", JSON.stringify(req.body));
    console.log("formdata recieved : ", JSON.stringify(req.body.formData));

    // File name for the Excel file
    const fileName = 'data.xlsx';

    const data = req.body.formData;

    // Create the Excel file
    const excelFile = createExcelFile(data, fileName);

    sendEmailWithAttachment(excelFile)
        .then(() => {
            console.log('Email sent successfully!');
            res.status(200).json({ status: 'ok', message: 'Report submitted successfully' });
        })
        .catch((error) => {
            console.error('Failed to send email. Error:', error.message);
            res.status(500).json({ status: 'ok', message: 'Error' });
        });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running correctly' });
});

const port = 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

async function sendEmailWithAttachment(excelFile) {
    try {
        // Create a nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', // e.g., 'gmail', 'yahoo', etc. (Check nodemailer documentation for supported services)
            auth: {
                user: 'unsecure.verma.rahul@gmail.com', // Your email address
                pass: 'yyjrhjsloxzbqtqi', // Your email password or application-specific password
            },
        });

        // Define the email options
        const mailOptions = {
            from: 'unsecure.verma.rahul@gmail.com', // Sender email address
            to: 'rahul.mrrv@gmail.com', // Recipient email address
            subject: 'Excel File Attachment',
            text: 'The Excel file is attached.',
            attachments: [
                {
                    filename: excelFile.name,
                    content: excelFile.buffer,
                },
            ],
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
    } catch (error) {
        throw error;
    }
}