require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const sendMail = async () => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "{sender email address}",
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken,
      },
    });

    const options = {
      from: "Service Name< {sender email address} >",
      to: "{receiver email address}",
      subject: "Google Email API Test",
      text: "Hello from gmail email using API",
      html: "<h1>Hello from gmail email using API</h1>",
    };

    const result = await transport.sendMail(options);
    return result;
  } catch (error) {
    console.error(`sendMail - ${error}`);
  }
};

sendMail()
  .then((result) => console.log("Success: ", result))
  .catch((error) => console.error("Fail: ", error));
