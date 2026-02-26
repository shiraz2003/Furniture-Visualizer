import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { GoogleLogin } from '@react-oauth/google';import loginBg from '/furniture2.jpg';
export default function RegisterPage() {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const navigate = useNavigate();

    async function register() {
        // Validation
        if (!firstname || !lastname || !email || !password) {
            toast.error("Please fill in all required fields!");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters!");
            return;
        }

        try {
            const response = await axios.post(
                import.meta.env.VITE_BACKEND_URL + "/api/auth/register",
                {
                    firstname,
                    lastname,
                    email,
                    phone,
                    password
                }
            );
            console.log(response.data);
            toast.success("Registration successful! Please login.");
            navigate("/login");
        } catch (error) {
            console.error("Registration error!", error);
            if (error.response?.status === 409) {
                toast.error("Email already exists!");
            } else {
                toast.error("Registration failed! Please try again.");
            }
        }
    }

    async function handleGoogleRegister(credentialResponse) {
        try {
            console.log(credentialResponse);
            const response = await axios.post(
                import.meta.env.VITE_BACKEND_URL + "/api/users/google-login",
                {
                    credential: credentialResponse.credential
                }
            );
            localStorage.setItem("token", response.data.token);
            toast.success("Registration successful!");

            if (response.data.role === 'admin') {
                navigate("/admin/");
            } else {
                navigate("/");
            }
        } catch (error) {
            console.error("Google registration error!", error);
            toast.error("Google registration failed!");
        }
    }

    return (
        <div className="w-full min-h-screen bg-cover bg-center flex justify-center items-center py-8" style={{ backgroundImage: `url(${loginBg})` }}>
            <div className="w-[500px] max-h-[90vh] backdrop-blur-sm shadow-2xl rounded-lg flex flex-col items-center gap-4 text-white py-6 px-4 overflow-y-auto">
                <h1 className="text-2xl font-bold">Create Account</h1>
                <p className="text-sm">Please fill in your details</p>

                <div className="w-full flex gap-3">
                    <input
                        onChange={(e) => setFirstname(e.target.value)}
                        type="text"
                        placeholder="First Name"
                        className="w-1/2 p-3 rounded-lg text-white outline-none hover:border-2"
                    />
                    <input
                        onChange={(e) => setLastname(e.target.value)}
                        type="text"
                        placeholder="Last Name"
                        className="w-1/2 p-3 rounded-lg text-white outline-none hover:border-2"
                    />
                </div>

                <input
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Email"
                    className="w-[80%] p-3 rounded-lg text-white outline-none hover:border-2"
                />

                <input
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                    placeholder="Phone Number"
                    className="w-[80%] p-3 rounded-lg text-white outline-none hover:border-2"
                />

                <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Password"
                    className="w-[80%] p-3 rounded-lg text-white outline-none hover:border-2"
                />

                <input
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password"
                    placeholder="Confirm Password"
                    className="w-[80%] p-3 rounded-lg text-white outline-none hover:border-2"
                />

                <button
                    onClick={register}
                    className="w-[80%] p-3 bg-amber-500 rounded-lg font-bold hover:bg-secondary hover:text-white transition-colors"
                >
                    Register
                </button>

                <div className="w-[80%] flex items-center gap-4">
                    <div className="flex-1 h-[1px] bg-white/30"></div>
                    <span className="text-sm">OR</span>
                    <div className="flex-1 h-[1px] bg-white/30"></div>
                </div>

                <div className="w-[80%] flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleRegister}
                        onError={() => {
                            toast.error('Google registration failed!');
                        }}
                    />
                </div>

                <p className="text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-secondary cursor-pointer hover:text-green-300">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}