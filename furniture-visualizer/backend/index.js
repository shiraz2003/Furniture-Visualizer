import 'dotenv/config';
import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import userRouter from './routes/userrouter.js';

const app = express();
app.use((req, res, next) => {
    const value = req.headers['authorization'];
    if(value !== null){
       const token = value.replace('Bearer ', '');
       jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(decoded == null){
            return res.status(401).json({ message: "Unauthorized" , error: err.message });
    }else{
        req.user = decoded;
        next();
    }
         })
    }else{
        next();
    }

});


app.use('/api', userRouter);

const connectionString =  process.env.MONGODB_URI;
mongoose.connect(connectionString)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(5000, () => {
            console.log('Server is running on port 5000');
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });



    //bhZlNsOmTm9lBQy6    yehanjb_db_user