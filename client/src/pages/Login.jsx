import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { GoogleLogin } from '@react-oauth/google';
import loginBg from '/furniture1.jpg';


export default function LoginPage() {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

   async function login() {
        try {
            console.log(email, password);
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL+"/api/auth/login", { email, password });
            console.log(response.data);
            localStorage.setItem("token", response.data.token);
            const fullName = `${response.data.user.firstname} ${response.data.user.lastname}`;
            localStorage.setItem("userName", fullName);
            localStorage.setItem("userRole", response.data.user.role);
            toast.success("Login successful!");

            if (response.data.role === 'admin') {
                navigate("/admin/");
            }else {
                navigate("/");
            }
        } catch (error) {
            console.error("There was an error!", error);
            if (error.response?.status === 401) {
                toast.error("Invalid email or password!");
            } else if (error.response?.status === 404) {
                toast.error("Account not found. Please sign up first!");
            } else {
                toast.error("Login failed! Please try again.");
            }
        }
    }

    async function handleGoogleLogin(credentialResponse) {
        try {
            console.log(credentialResponse);
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL+"/api/users/google-login", { 
                credential: credentialResponse.credential 
            });
            localStorage.setItem("token", response.data.token);
            toast.success("Google login successful!");
            
            if (response.data.role === 'admin') {
                navigate("/admin/");
            } else {
                navigate("/");
            }
        } catch (error) {
            console.error("Google login error!", error);
            toast.error("Google login failed!");
        }
    }
  return (
    <div className="w-full h-screen bg-cover bg-center flex justify-center items-center py-8" style={{ backgroundImage: `url(${loginBg})` }}>
      <div className="w-[500px] max-h-[90vh] backdrop-blur-sm shadow-2xl rounded-lg flex flex-col items-center gap-6 text-white py-6 px-4 overflow-y-auto">
        <h1 className="text-2xl font-bold text-center text-amber-300">Login</h1>
        <p className="text-sm">Please enter your credentials</p>
        <input
            onChange={(e) => {
              setEmail(e.target.value), console.log("Email changed");
            }}
          type="email"
          placeholder="Email"
          className="w-[80%] p-3 rounded-lg text-white outline-none hover:border-2"
        />
        <input
          onChange={(e) => {
            setPassword(e.target.value), console.log("Password changed");
          }}
          type="password"
          placeholder="Password"
          className="w-[80%] p-3 rounded-lg text-white outline-none hover:border-2"
        />
        <button onClick={login} className="w-[80%] p-3 bg-amber-500 rounded-lg font-bold hover:bg-secondary hover:text-white transition-colors">
          Login
        </button>
        
        <div className="w-[80%] flex items-center gap-4">
          <div className="flex-1 h-[1px] bg-white/30"></div>
          <span className="text-sm">OR</span>
          <div className="flex-1 h-[1px] bg-white/30"></div>
        </div>

        <div className="w-[80%] flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => {
              toast.error('Google login failed!');
            }}
          />
        </div>

        <p className="text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-secondary cursor-pointer  hover:text-green-300">
            Sign Up
          </Link>
          
        </p>
        <p className="text-sm">
          
          <Link to="/forgot-password" className="text-secondary cursor-pointer  hover:text-green-300">
            Forgot password
          </Link>
        </p>
      </div>
    </div>
  );
}



