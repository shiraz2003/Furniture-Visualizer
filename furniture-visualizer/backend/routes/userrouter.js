import express from 'express';
import { createUser, loginUser } from '../controller/usercontroller.js';

const userRouter = express.Router();

userRouter.post('/users', createUser);
userRouter.post('/login', loginUser);

export default userRouter;