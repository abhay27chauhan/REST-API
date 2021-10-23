const nodemailer = require("nodemailer");

const EMAIL_USERNAME = "chauhan27.abhay@gmail.com";
const EMAIL_PASSWORD = "ecnzpucgksjsowud"
;
const sendEmail = async (email, subject, payload) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        secure: true, 
        auth: {
            user: EMAIL_USERNAME,
            pass: EMAIL_PASSWORD,
        },
    });

    const options = () => {
      return {
        from: EMAIL_USERNAME,
        to: email,
        subject: subject,
        html: `<h1>${payload.name}</h1><br/><a href=${payload.link}>Link</a>`,
      };
    };

    // Send email
    transporter.sendMail(options(), (error, info) => {
      if (error) {
        return error;
      } else {
        return res.status(200).json({
          success: true,
        });
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
);
*/

module.exports = sendEmail;