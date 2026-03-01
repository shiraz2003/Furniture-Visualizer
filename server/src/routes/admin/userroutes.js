import express from 'express';
import { getAllUsers, createUser, deleteUser } from '../../controllers/admin/usercontroller.js';

const router = express.Router();

router.get('/users', getAllUsers);
router.post('/users', createUser);
router.delete('/users/:id', deleteUser);

export default router;