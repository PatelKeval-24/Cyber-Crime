import nodemailer from "nodemailer"
import crypto from "crypto"
// controllers/authController.js
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// 1. SEND OTP
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Save OTP and expiry to User model
  user.resetOtp = otp;
  user.resetOtpExpires = Date.now() + 600000; // 10 minutes
  await user.save();

  // Configure Mailer (Use your Gmail/SMTP details)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: 'your-email@gmail.com', pass: 'your-app-password' }
  });

  await transporter.sendMail({
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`
  });

  res.json({ status: "success", message: "OTP sent to email" });
};

// 2. VERIFY OTP & RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ 
    email, 
    resetOtp: otp, 
    resetOtpExpires: { $gt: Date.now() } 
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  
  // Clear OTP fields
  user.resetOtp = undefined;
  user.resetOtpExpires = undefined;
  await user.save();

  res.json({ status: "success", message: "Password updated successfully" });
};