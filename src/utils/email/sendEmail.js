const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
// set a refresh token
const OAuth2_client = new OAuth2(
  process.env.clientId,
  process.env.clientSecret
);
OAuth2_client.setCredentials({ refresh_token: process.env.refresh_token });
const sendEmail = async (email, subject, payload, template) => {
  try {
    const accessToken = OAuth2_client.getAccessToken();
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.user,
        clientId: process.env.clientId,
        clientSecret: process.env.clientSecret,
        refreshToken: process.env.refresh_token,
        accessToken: accessToken,
      },
    });

    const source = fs.readFileSync(path.join(__dirname, template), "utf8");
    const compiledTemplate = handlebars.compile(source);
    const options = () => {
      return {
        from: `The best of <${process.env.user}>`,
        to: email,
        subject: subject,
        html: compiledTemplate(payload),
      };
    };

    // Send email
    transporter.sendMail(options(), (error, info) => {
      if (error) {
        console.log(error, "transporteer error");
        return error;
      } else {
        console.log(success, "transporter success");
        return "success";
      }
    });
  } catch (error) {
    return error;
  }
};

/*
Example:
sendEmail(
  "youremail@gmail.com,
  "Email subject",
  { name: "Eze" },
  "./templates/layouts/main.handlebars"
);
*/

module.exports = sendEmail;
