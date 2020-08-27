const nodemailer = require('nodemailer')
const pug = require('pug')
const htmlTotext = require('html-to-text')

// --class for email
module.exports = class Email {
    constructor(user,url) {
        this.to = user.email;
        this.firstname = user.name.split(' ')[0];
        this.url = url;
        this.from = `Okidi Jimmy <${process.env.EMAIL_FROM}>`
    }

    newTransport() {
        if(process.env.NODE_ENV === 'production') {
            // sender id
            return 1
        }
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,  // servie
            port: process.env.EMAIL_PORT,
            auth: { // auth properties wch  is stored in the config.env file
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }  
            // activate in gmail the "less secure app options"(gmail is not gd for prod app)
        })
    }
    // --send method to send email
    async send(template, subject) {
        // 1) render html based on a pug template
        const html =  pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            firstname: this.firstname,
            url: this.url,
            subject

        })

        // 2) define the email options
        const mailOptions = {
                    // specify where the email is coming from
                    from: this.from,
                    to: this.to,
                    subject,
                    text: htmlTotext.fromString(html), //convert html to text
                    html
                }
        // 3) create a transport and create an email
        await this.newTransport().sendMail(mailOptions)

    }
    async sendWelcome() {
        await this.send('welcome', 'Welcome to the natours family')

    }

    // --sendPasswordReset
    async sendPasswordRest() {
        await this.send('passwordReset',
        'Your password reset token (valid for only 10 minutes')
    }
}


