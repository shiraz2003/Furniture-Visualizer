import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { HiMail, HiArrowLeft, HiKey, HiLockClosed } from "react-icons/hi";
import loginBg from '/furniture1.jpg';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: email, 2: otp & password, 3: success

    async function handleSendOTP() {
        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setLoading(true);
        try {
            await axios.post(
                import.meta.env.VITE_BACKEND_URL + "/api/auth/send-reset-password-otp",
                { email }
            );
            toast.success("OTP sent to your email!");
            setStep(2);
        } catch (error) {
            console.error("Error sending OTP:", error);
            if (error.response?.status === 404) {
                toast.error("No account found with this email address");
            } else {
                toast.error("Failed to send OTP. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleResetPassword() {
        if (!otp) {
            toast.error("Please enter the OTP");
            return;
        }
        if (!newPassword) {
            toast.error("Please enter a new password");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            await axios.post(
                import.meta.env.VITE_BACKEND_URL + "/api/auth/reset-password",
                { email, otp, newPassword }
            );
            toast.success("Password reset successful!");
            setStep(3);
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            console.error("Error resetting password:", error);
            if (error.response?.status === 404) {
                toast.error("OTP not found or expired");
            } else if (error.response?.status === 400) {
                toast.error(error.response.data.message || "Invalid OTP");
            } else {
                toast.error("Failed to reset password. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full h-screen bg-cover bg-center flex justify-center items-center py-8" style={{ backgroundImage: `url(${loginBg})` }}>
            <div className="w-[500px] max-h-[90vh] backdrop-blur-sm shadow-2xl rounded-lg flex flex-col items-center gap-6 text-white py-6 px-4 overflow-y-auto">
                {/* Back to Login Link */}
                <Link 
                    to="/login" 
                    className="flex items-center gap-2 text-amber-300 hover:text-amber-200 transition-colors self-start"
                >
                    <HiArrowLeft className="text-xl" />
                    <span className="text-sm">Back to Login</span>
                </Link>

                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mb-4">
                        {step === 1 ? <HiMail className="text-3xl text-white" /> : 
                         step === 2 ? <HiKey className="text-3xl text-white" /> :
                         <HiLockClosed className="text-3xl text-white" />}
                    </div>
                    <h1 className="text-2xl font-bold text-amber-300 mb-2">
                        {step === 1 ? "Forgot Password?" : 
                         step === 2 ? "Verify OTP" : 
                         "Password Reset!"}
                    </h1>
                    <p className="text-sm text-white/80">
                        {step === 1 ? "No worries! Enter your email and we'll send you an OTP." :
                         step === 2 ? "Enter the OTP sent to your email and create a new password." :
                         "Your password has been reset successfully!"}
                    </p>
                </div>

                {step === 1 ? (
                    // Step 1: Email Input
                    <>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendOTP()}
                            className="w-[80%] p-3 rounded-lg text-white outline-none hover:border-2"
                            disabled={loading}
                        />

                        <button
                            onClick={handleSendOTP}
                            disabled={loading}
                            className="w-[80%] p-3 bg-amber-500 rounded-lg font-bold hover:bg-amber-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Sending..." : "Send OTP"}
                        </button>

                        <p className="text-sm">
                            Remember your password?{" "}
                            <Link to="/login" className="text-amber-300 hover:text-amber-200 cursor-pointer">
                                Sign in
                            </Link>
                        </p>
                    </>
                ) : step === 2 ? (
                    // Step 2: OTP & Password Reset
                    <>
                        <div className="w-[80%] bg-amber-500/20 border border-amber-500/50 rounded-lg p-3 text-center">
                            <p className="text-amber-200 text-sm">
                                OTP sent to <strong>{email}</strong>
                            </p>
                        </div>

                        <input
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            maxLength={6}
                            className="w-[80%] p-3 rounded-lg text-white outline-none hover:border-2 tracking-widest text-center font-semibold"
                            disabled={loading}
                        />

                        <input
                            type="password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-[80%] p-3 rounded-lg text-white outline-none hover:border-2"
                            disabled={loading}
                        />

                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleResetPassword()}
                            className="w-[80%] p-3 rounded-lg text-white outline-none hover:border-2"
                            disabled={loading}
                        />

                        <button
                            onClick={handleResetPassword}
                            disabled={loading}
                            className="w-[80%] p-3 bg-amber-500 rounded-lg font-bold hover:bg-amber-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>

                        <div className="text-center">
                            <p className="text-sm text-white/80 mb-2">
                                Didn't receive the OTP?
                            </p>
                            <button
                                onClick={() => {
                                    setStep(1);
                                    setOtp("");
                                    setNewPassword("");
                                    setConfirmPassword("");
                                }}
                                className="text-amber-300 hover:text-amber-200 font-semibold text-sm cursor-pointer"
                            >
                                Resend OTP
                            </button>
                        </div>
                    </>
                ) : (
                    // Step 3: Success State
                    <>
                        <div className="w-[80%] bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-center">
                            <p className="text-green-200 text-sm">
                                Your password has been reset successfully!
                            </p>
                        </div>

                        <Link
                            to="/login"
                            className="w-[80%] p-3 bg-amber-500 rounded-lg font-bold hover:bg-amber-600 text-center hover:text-white transition-colors"
                        >
                            Go to Login
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}