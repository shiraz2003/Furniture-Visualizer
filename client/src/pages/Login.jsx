import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useGoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    async function login() {
        try {
            console.log(email, password);
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/auth/login", { email, password });
            console.log(response.data);
            localStorage.setItem("token", response.data.token);
            const fullName = `${response.data.user.firstname} ${response.data.user.lastname}`;
            localStorage.setItem("userName", fullName);
            localStorage.setItem("userRole", response.data.user.role);
            toast.success("Login successful!");

            if (response.data.user.role === 'admin') {
                navigate("/admin");
            } else {
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

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (credentialResponse) => {
            try {
                const response = await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/auth/google-login", {
                    accessToken: credentialResponse.access_token
                });
                localStorage.setItem("token", response.data.token);
                toast.success("Google login successful!");

                if (response.data.user.role === 'admin') {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            } catch (error) {
                console.error("Google login error!", error);
                toast.error(error.response?.data?.error || "Google login failed!");
            }
        },
        onError: () => {
            toast.error('Google login failed!');
        }
    });

    return (
        /* Full Screen Background Image with Center Alignment */
        <div 
            className="w-full min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center relative px-4" 
            style={{ backgroundImage: "url('/login.jpeg')" }}
        >
            {/* Dark Overlay over the entire background image */}
            <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>

            {/* Center Overlay Form Area */}
            <div className="w-full max-w-[450px] relative z-10">
                <div className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
                    
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">Welcome Back</h1>
                        <p className="text-sm text-white/60 font-medium">Please enter your credentials to access your account.</p>
                    </div>

                    <div className="space-y-5">
                        
                        {/* Email Input */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-white/70 uppercase tracking-widest ml-1">Email</label>
                            <input
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                                type="email"
                                placeholder="Enter your email"
                                className="w-full p-3.5 sm:p-4 rounded-xl border border-white/10 bg-white/5 text-white outline-none focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24] transition-all font-medium placeholder:text-white/30 backdrop-blur-md"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[11px] font-bold text-white/70 uppercase tracking-widest">Password</label>
                                <Link to="/forgot-password" className="text-[11px] font-bold text-[#FBBF24] hover:text-white transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                                type="password"
                                placeholder="••••••••"
                                className="w-full p-3.5 sm:p-4 rounded-xl border border-white/10 bg-white/5 text-white outline-none focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24] transition-all font-medium placeholder:text-white/30 backdrop-blur-md"
                            />
                        </div>

                        {/* Login Button */}
                        <button 
                            onClick={login} 
                            className="w-full mt-4 p-3.5 sm:p-4 bg-[#FBBF24] text-slate-900 rounded-xl font-bold text-[15px] hover:bg-[#f5b000] active:scale-[0.98] transition-all shadow-xl"
                        >
                            Login
                        </button>
                        
                        {/* Divider */}
                        <div className="flex items-center gap-4 py-4">
                            <div className="flex-1 h-[1px] bg-white/10"></div>
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Or Continue With</span>
                            <div className="flex-1 h-[1px] bg-white/10"></div>
                        </div>

                        {/* Custom Google Login Button */}
                        <button 
                            onClick={() => handleGoogleLogin()} 
                            className="w-full flex items-center justify-center gap-3 p-3.5 sm:p-4 bg-[#252525] hover:bg-[#2a2a2a] text-white/90 rounded-xl border border-white/10 font-medium text-[15px] active:scale-[0.98] transition-all"
                        >
                            <svg className="w-5 h-5 bg-white p-[2px] rounded-sm" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Sign in with Google
                        </button>

                        {/* Sign Up Link */}
                        <div className="pt-4 text-center">
                            <p className="text-sm font-medium text-white/60">
                                Don't have an account?{" "}
                                <Link to="/register" className="font-bold text-[#FBBF24] hover:text-white transition-colors">
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                        
                    </div>
                </div>
            </div>
            
        </div>
    );
}