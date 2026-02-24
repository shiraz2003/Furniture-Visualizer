import express from 'express';
import { createUser, loginUser, sendResetPasswordOTP, verifyOTP, resetPassword } from '../controllers/authController.js';

const userRouter = express.Router();

userRouter.post('/register', createUser);
userRouter.post('/login', loginUser);


userRouter.post("/send-reset-password-otp", sendResetPasswordOTP);
userRouter.post("/verify-otp", verifyOTP);
userRouter.post("/reset-password", resetPassword);

export default userRouter;