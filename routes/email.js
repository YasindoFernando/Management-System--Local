const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const TemporaryPassword =
  require("../models/temporaryPassword").TemporaryPassword;

const nodemailer = require("nodemailer");

router.post("/sendEmail", async (req, res) => {
  try {
    const email = req.body.Email;

    const temporaryString = String(mongoose.Types.ObjectId());

    const user = await TemporaryPassword.findOne({ email: email }).catch(
      (error) => {
        console.error(error);
      }
    );

    if (user) {
      await TemporaryPassword.updateOne(
        { email: email },
        { $set: { password: temporaryString } }
      ).catch((error) => {
        console.error(error);
      });
    } else {
      let temporaryPassword = new TemporaryPassword();
      temporaryPassword.email = email;
      temporaryPassword.password = temporaryString;
      await temporaryPassword.save().catch((error) => {
        console.error(error);
      });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      keepBcc: true,
      auth: {
        user: "fernandoyasindo@gmail.com",
        pass: "ansenfjqhrqxtaud",
      },
      tls: {
        rejectUnauthorized: false, //unathoutized access allow
      },
    });

    const hotelMailOptions = {
      from: '"WebApp" <fernandoyasindo@gmail.com>',
      to: `${email}`,
      subject: "Password reset",
      html: `
        <!DOCTYPE html>
        <html lang="en-US">
          <head>
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <title>Reset Password Email Template</title>
            <meta name="description" content="Reset Password Email Template." />
            <style type="text/css">
              a:hover {text-decoration: underline !important;}
            </style>
          </head>
        
          <body
            marginheight="0"
            topmargin="0"
            marginwidth="0"
            style="margin: 0px; background-color: #f2f3f8;"
            leftmargin="0"
          >
            <!--100% body table-->
            <table
              cellspacing="0"
              border="0"
              cellpadding="0"
              width="100%"
              bgcolor="#f2f3f8"
              style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;"
            >
              <tr>
                <td>
                  <table
                    style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;"
                    width="100%"
                    border="0"
                    align="center"
                    cellpadding="0"
                    cellspacing="0"
                  >
                    <tr>
                      <td style="height:80px;">&nbsp;</td>
                    </tr>
                    <tr>
                      <td style="text-align:center;">
                        <a href="https://rakeshmandal.com" title="logo" target="_blank">
                          <img
                            width="60"
                            src="https://i.ibb.co/hL4XZp2/android-chrome-192x192.png"
                            title="logo"
                            alt="logo"
                          />
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                      <td>
                        <table
                          width="95%"
                          border="0"
                          align="center"
                          cellpadding="0"
                          cellspacing="0"
                          style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);"
                        >
                          <tr>
                            <td style="height:40px;">&nbsp;</td>
                          </tr>
                          <tr>
                            <td style="padding:0 35px;">
                              <h1
                                style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;"
                              >
                                You have requested to reset your password
                              </h1>
                              <span
                                style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"
                              ></span>
                              <p
                                style="color:#455056; font-size:15px;line-height:24px; margin:0;"
                              >
                                We cannot simply send you your old password. A unique
                                link to reset your password has been generated for you.
                                To reset your password, click the following link and
                                follow the instructions.
                              </p>
                              <H2>Password: ${temporaryString}</H2>
                              <a
                                href="LOGIN_URL" 
                                style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;"
                                >Reset Password</a
                              >
                            </td>
                          </tr>
                          <tr>
                            <td style="height:40px;">&nbsp;</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
        
                    <tr>
                      <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                      <td style="text-align:center;">
                        <p
                          style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;"
                        >
                          &copy;
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="height:80px;">&nbsp;</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <!--/100% body table-->
          </body>
        </html>`,
    };

    transporter.sendMail(hotelMailOptions, function (error, info) {
      if (error) {
        console.error(error);
        res.status(500).send("FAILED");
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).send("SUCCESS");
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("FAILED");
  }
});

module.exports = router;
