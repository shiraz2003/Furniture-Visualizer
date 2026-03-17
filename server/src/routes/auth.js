import express from 'express';
import { createUser, loginUser, sendResetPasswordOTP, verifyOTP, resetPassword, getUserProfile, updateUserProfile , googleLoginUser} from '../controllers/authController.js';
import jwt from 'jsonwebtoken';


const userRouter = express.Router();

// Middleware to authenticate user
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

userRouter.post('/register', createUser);
userRouter.post('/login', loginUser);
userRouter.post("/google-login", googleLoginUser);

userRouter.post("/send-reset-password-otp", sendResetPasswordOTP);
userRouter.post("/verify-otp", verifyOTP);
userRouter.post("/reset-password", resetPassword);
userRouter.get("/profile", authenticateToken, getUserProfile);
userRouter.put("/profile", authenticateToken, updateUserProfile);

export default userRouter;