const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');

const auth = {
    auth: {
        api_key: 'f56cef5454fc53a2d0e245f34cffbace-9b1bf5d3-2526fe32',
        domain: 'sandbox3d1d76dbf0974d7596508115b085dc0f.mailgun.org'
    }
};

const transporter = nodemailer.createTransport(mailGun(auth));

const sendMail = (subject, email, text, cb) => {
    const mailOptions = {
        from: email,
        to: 'natethegreatsims@gmail.com',
        subject: subject,
        text: text
    }

    transporter.sendMail(mailOptions, function(err, data) {
        if (err) {
            return cb(err, null);
        } else {
            return cb(null, data);
        }
    });
}

module.exports = sendMail;