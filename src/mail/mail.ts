import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.eu", // SMTP-сервер из настроек
  port: 465, // SSL-порт из настроек
  secure: true, // true для 465, false для 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default transporter;

// const mailOptions = {
//   from: "info@deviliamorozov.co.uk",
//   to: "concreteager@gmail.com",
//   subject: "Reset your password",
//   text: `Click the link to reset your password: `,
//   html: `<p>Click the link to reset your password: <a href="">Reset Password</a></p>`,
// };

// await transporter.sendMail(mailOptions);
