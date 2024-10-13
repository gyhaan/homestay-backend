const nodemailer = require("nodemailer");

let transporter;

if (process.env.NODE_ENV === "development") {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
} else {
  transporter = nodemailer.createTransport({
    service: "SendGrid",
    auth: {
      user: process.env.SENDGRID_USER,
      pass: process.env.SENDGRID_PASS,
    },
  });
}

async function sendEmail(options) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" <ganzaowenyhaan@gmail.com>', // sender address
    to: options.to || "bar@example.com, baz@example.com", // list of receivers
    subject: options.subject || "Hello ✔", // Subject line
    text: options.text || "Hello world?", // plain text body
    html: `<p>${options.text}</p>`, // html body
  });
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

module.exports = sendEmail;
