import express from "express";
import User from "../model/usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export function createUser(req, res) {
    const passwordHash = bcrypt.hashSync(req.body.password, 10);
    const userData = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: passwordHash,
        role: req.body.role || "user",
    };
  const user = new User(userData);
  user
    .save()
    .then(() => res.status(201).json({ message: "User created successfully" }))
    .catch((error) =>
      res.status(400).json({
        message: "Error creating user",
        error: error.message,
      }),
    );
}

export function loginUser(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }else{
            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if(isPasswordValid){
                const token = jwt.sign({
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    role: user.role
                 }, process.env.JWT_SECRET, { expiresIn: '1h'
                })
                res.status(200).json({ message: "Login successful", token: token, user: user });
            }else{
                res.status(401).json({ message: "Invalid password" });
            }
        }})
        .catch((error) =>
            res.status(500).json({
                message: "Error logging in",
                error: error.message,
            }),
        );

           
    
        
}
