const express = require('express')
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser');
var public = path.join(__dirname, 'public');
var sgMail = require('@sendgrid/mail')
var dotenv = require('dotenv')

dotenv.config()
const app = express()

let PORT = process.env.PORT || 3002

//middleware
app.use(express.json());
app.use(cors());

app.use('/', express.static(public));
app.use(bodyParser.urlencoded({ extended: true }));

//allow access
app.all("/*", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    next();
});

//index page
app.get("/", (req, res) => {
    res.sendFile(path.join(public, 'index.html'));
})

//sending mail
app.post("/contact.php", (req, res) => {
    const { name, email, message, subject } = req.body
    try {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const msg = {
            to: "raghavaanand22@gmail.com",
            from: {
                name: "Portfolio Contact",
                email: process.env.ACC_EMAIL
            },
            subject: subject,
            text: `You have received a new message from your website contact form.\n\nHere are the details:\n\nName: ${name}\n\nEmail: ${email}\n\nSubject: ${subject}\n\nMessage: ${message}`

        }
        sgMail.send(msg)
        res.send(req.body);
    }
    catch (err) {
        console.log(err);
    }
})

app.listen(PORT, () => console.log("listening on " + PORT))