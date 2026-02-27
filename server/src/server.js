import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path'; // පාලනය සඳහා එක් කළා
import { fileURLToPath } from 'url'; // ES Modules සඳහා එක් කළා
import userRouter from './routes/auth.js';
import adminRoutes from './routes/admin/userroutes.js';
import furnitureRoutes from './routes/admin/furnitureroutes.js'; // අලුතින් එක් කළ Furniture Routes

const app = express();

// ES Modules වලදී folder path එක නිවැරදිව ලබා ගැනීමට (Static folder එක සඳහා අවශ්‍ය වේ)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS middleware - allow requests from frontend
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000'],
    credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploads folder එක public කිරීම (Frontend එකට GLB ෆයිල් ලබා ගැනීමට මෙය අත්‍යවශ්‍ය වේ)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes සම්බන්ධ කිරීම
app.use('/api/admin', adminRoutes);
app.use('/api/auth', userRouter);
app.use('/api/furniture', furnitureRoutes); // අලුත් Furniture API එක මෙතැනින් වැඩ කරයි


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