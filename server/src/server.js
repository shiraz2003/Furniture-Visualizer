import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/auth.js';

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', userRouter);

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



  