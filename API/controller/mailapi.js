import nodemailer from "nodemailer";

function sendMail(email, password, otp) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "aashutoshchouhan2@gmail.com",
      pass: "evrecjwisfghixao",
    },
  });

  var mailOptions = {
    from: "aashutoshchouhan2@gmail.com",
    to: email,
    subject: "Doctorzz!",
    html: `<h1>Congratulations! You have successfully registered on doctorz,</h1>
    <h2> Your login credentials are attached below</h2>
    <h5>Your email : ${email}</h5>
    <h5>Your password : ${password}</h5>
    <h2>Click the link below to redirect to Login</h2>
     http://localhost:3000/verifyuser/${email}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

export default sendMail;
