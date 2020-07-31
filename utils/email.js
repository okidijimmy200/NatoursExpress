const nodemailer = require('nodemailer')

const sendEmail = async options => {
    // email address, subject line, email content
    // 1) Create a transporter ie gmail
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,  // servie
        port: process.env.EMAIL_PORT,
        auth: { // auth properties wch  is stored in the config.env file
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }  
        // activate in gmail the "less secure app options"(gmail is not gd for prod app)
    })
    // 2) Define the email options
    const mailOptions = {
        // specify where the email is coming from
        from: 'Okidi Jimmy <hello@jimmy.io>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html:
    }
    // 3) Send the email with nodemailer
    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail;