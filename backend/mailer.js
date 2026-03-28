import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { log } from 'console';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail', // This automatically sets host to smtp.gmail.com
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail: kp562010@gmail.com
    pass: process.env.EMAIL_PASS, // The 16-digit App Password (no spaces)
  },
});

/**
 * Sends a professional OTP email
 */
export const sendOTPEmail = async (email, otp) => {
  console.log(email,otp,"detail for sending the email")
  const mailOptions = {
    from: `"Cybercrime Portal" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "OTP for Password Reset",
    html: `
      <div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2">
        <div style="margin: 50px auto; width: 70%; padding: 20px 0">
          <div style="border-bottom: 1px solid #eee">
            <a href="" style="font-size: 1.4em; color: #00466a; text-decoration: none; font-weight: 600">Cybercrime Portal</a>
          </div>
          <p style="font-size: 1.1em">Hi,</p>
          <p>Use the following OTP to complete your Password Reset procedures. OTP is valid for 10 minutes</p>
          <h2 style="background: #00466a; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">${otp}</h2>
          <p style="font-size: 0.9em;">Regards,<br />Scaninfoga Solution Pvt.</p>
          <hr style="border: none; border-top: 1px solid #eee" />
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return { success: true };
  } catch (error) {
    console.error("Nodemailer Error:", error);
    return { success: false, error: error.message };
  }
};