import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstname : {
        type : String,
        required : true
    },
    lastname : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    phone : {
        type : String,
        required : false
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        enum : ['customer', 'admin'],
        default : 'customer'
    }
}, {timestamps : true}
);

const User = mongoose.model('User', userSchema);

export default User;

/*
{
  "firstname": "Admin",
  "lastname": "User",
  "email": "admin@furniture-visualizer.com",
  "password": "Admin123!",
  "role": "admin"
}
*/