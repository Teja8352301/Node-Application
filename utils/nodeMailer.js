const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport')

let options = {
    auth: {
        api_key: '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'
    }
}

let mailer = nodemailer.createTransport(sgTransport(options))

module.exports = mailer