import express from 'express';
import { createUser } from '../controller/usercontroller.js';

const userRouter = express.Router();

userRouter.post('/users', createUser);

export default userRouter;