const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {

        user: "vaishnawiranjan7070@gmail.com",

        pass: "zsrw qdxm kude oznp"

    }

});

module.exports = transporter;