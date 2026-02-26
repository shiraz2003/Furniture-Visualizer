import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRouter from './routes/auth.js';
import adminRoutes from './routes/admin/admin.js';

const app = express();

// CORS middleware - allow requests from frontend
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000'],
    credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/admin', adminRoutes);
app.use('/api/auth', userRouter);


const connectionString = process.env.MONGO_URI;
mongoose.connect(connectionString)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(process.env.PORT , () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });



  