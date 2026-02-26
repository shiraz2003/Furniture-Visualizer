import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// For now, we'll create a simple in-memory OTP storage
// In production, you should use a proper database model
const otpStorage = new Map();

// Email transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER || 'yehanjb@gmail.com',
    pass: process.env.EMAIL_PASS || 'morahpqkgzwszcta'
  }
});


export function createUser(req, res) {
    const passwordHash = bcrypt.hashSync(req.body.password, 10);
    const userData = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        password: passwordHash,
        role: req.body.role || "customer",
    };
  const user = new User(userData);
  user
    .save()
    .then(() => res.status(201).json({ message: "User created successfully" }))
    .catch((error) =>
      res.status(400).json({
        message: "Error creating user",
        error: error.message,
      }),
    );
}

export function loginUser(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }else{
            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if(isPasswordValid){
                const token = jwt.sign({
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    role: user.role
                 }, process.env.JWT_SECRET, { expiresIn: '1h'
                })
                res.status(200).json({ message: "Login successful", token: token, user: user });
            }else{
                res.status(401).json({ message: "Invalid password" });
            }
        }})
        .catch((error) =>
            res.status(500).json({
                message: "Error logging in",
                error: error.message,
            }),
        );

        
}



export async function sendResetPasswordOTP(req, res) {
  const email = req.body.email;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email address" });
    }

    // Store OTP in memory with expiration (10 minutes)
    otpStorage.set(email, {
      otp: otp,
      expireAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    // For now, just log the OTP to console (in production, send via email)
    console.log(`Reset Password OTP for ${email}: ${otp}`);
    
    // Uncomment the following lines to actually send email:
    /*
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Password Reset OTP - Furniture Visualizer',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password. Use the OTP below to reset your password:</p>
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="color: #1F2937; margin: 0; font-size: 36px; letter-spacing: 8px;">${otp}</h1>
          </div>
          <p><strong>This OTP will expire in 10 minutes.</strong></p>
          <p>If you didn't request this password reset, please ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    */
    
    res.status(200).json({ message: 'OTP sent successfully to your email' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
}

export async function verifyOTP(req, res) {
  const { email, otp } = req.body;

  try {
    // Find OTP entry in memory
    const otpEntry = otpStorage.get(email);

    if (!otpEntry) {
      return res.status(404).json({ message: "OTP not found or expired" });
    }

    // Check if OTP matches
    if (otpEntry.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if OTP has expired
    if (new Date() > otpEntry.expireAt) {
      otpStorage.delete(email);
      return res.status(400).json({ message: "OTP has expired" });
    }

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
}

export async function resetPassword(req, res) {
  const { email, otp, newPassword } = req.body;

  try {
    // Verify OTP one more time
    const otpEntry = otpStorage.get(email);

    if (!otpEntry) {
      return res.status(404).json({ message: "OTP not found or expired" });
    }

    if (otpEntry.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > otpEntry.expireAt) {
      otpStorage.delete(email);
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Hash new password
    const passwordHash = bcrypt.hashSync(newPassword, 10);

    // Update user password
    const user = await User.findOneAndUpdate(
      { email },
      { password: passwordHash },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete OTP entry after successful password reset
    otpStorage.delete(email);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
}
