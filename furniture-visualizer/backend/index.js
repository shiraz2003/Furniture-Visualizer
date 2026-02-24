import 'dotenv/config';
import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';

const app = express();
app.use(bodyParser.json());

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