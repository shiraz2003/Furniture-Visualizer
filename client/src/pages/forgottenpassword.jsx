import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { HiMail, HiArrowLeft, HiKey, HiLockClosed } from "react-icons/hi";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: email, 2: otp & password, 3: success

    const inputClassName =
        "w-full p-3.5 sm:p-4 rounded-xl border border-white/10 bg-white/5 text-white outline-none focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24] transition-all font-medium placeholder:text-white/30 backdrop-blur-md";

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
        <div
            className="w-full min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center relative px-4"
            style={{ backgroundImage: "url('/login.jpeg')" }}
        >
            <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl max-h-[92vh] overflow-y-auto">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-[12px] font-bold text-[#FBBF24] hover:text-white transition-colors mb-6"
                    >
                        <HiArrowLeft className="text-base" />
                        Back to Login
                    </Link>

                    <div className="mb-8 text-center">
                        <div className="mx-auto w-14 h-14 bg-[#FBBF24] rounded-full flex items-center justify-center mb-4 shadow-lg">
                            {step === 1 ? <HiMail className="text-2xl text-slate-900" /> :
                                step === 2 ? <HiKey className="text-2xl text-slate-900" /> :
                                    <HiLockClosed className="text-2xl text-slate-900" />}
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
                            {step === 1 ? "Forgot Password" :
                                step === 2 ? "Verify OTP" :
                                    "Password Reset"}
                        </h1>
                        <p className="text-sm text-white/60 font-medium leading-relaxed">
                            {step === 1 ? "Enter your email and we will send a one-time password." :
                                step === 2 ? "Use the OTP from your email and set a new secure password." :
                                    "Your password has been reset successfully."}
                        </p>
                    </div>

                    {step === 1 ? (
                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-white/70 uppercase tracking-widest ml-1">Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
                                    className={inputClassName}
                                    disabled={loading}
                                />
                            </div>

                            <button
                                onClick={handleSendOTP}
                                disabled={loading}
                                className="w-full mt-2 p-3.5 sm:p-4 bg-[#FBBF24] text-slate-900 rounded-xl font-bold text-[15px] hover:bg-[#f5b000] active:scale-[0.98] transition-all shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? "Sending..." : "Send OTP"}
                            </button>

                            <p className="text-sm text-center font-medium text-white/60 pt-2">
                                Remember your password?{" "}
                                <Link to="/login" className="font-bold text-[#FBBF24] hover:text-white transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    ) : step === 2 ? (
                        <div className="space-y-5">
                            <div className="w-full bg-[#FBBF24]/15 border border-[#FBBF24]/40 rounded-xl p-3 text-center">
                                <p className="text-[#FCD34D] text-sm font-medium break-all">
                                    OTP sent to {email}
                                </p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-white/70 uppercase tracking-widest ml-1">OTP</label>
                                <input
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                    maxLength={6}
                                    className={`${inputClassName} tracking-[0.35em] text-center font-semibold`}
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-white/70 uppercase tracking-widest ml-1">New Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className={inputClassName}
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-white/70 uppercase tracking-widest ml-1">Confirm Password</label>
                                <input
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                                    className={inputClassName}
                                    disabled={loading}
                                />
                            </div>

                            <button
                                onClick={handleResetPassword}
                                disabled={loading}
                                className="w-full p-3.5 sm:p-4 bg-[#FBBF24] text-slate-900 rounded-xl font-bold text-[15px] hover:bg-[#f5b000] active:scale-[0.98] transition-all shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>

                            <div className="text-center pt-1">
                                <p className="text-sm text-white/60 mb-2">Didn't receive the OTP?</p>
                                <button
                                    onClick={() => {
                                        setStep(1);
                                        setOtp("");
                                        setNewPassword("");
                                        setConfirmPassword("");
                                    }}
                                    className="text-[12px] font-bold text-[#FBBF24] hover:text-white transition-colors"
                                >
                                    Resend OTP
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            <div className="w-full bg-emerald-500/20 border border-emerald-500/40 rounded-xl p-4 text-center">
                                <p className="text-emerald-200 text-sm font-medium">
                                    Your password has been reset successfully!
                                </p>
                            </div>

                            <Link
                                to="/login"
                                className="w-full block p-3.5 sm:p-4 bg-[#FBBF24] text-slate-900 rounded-xl font-bold text-[15px] hover:bg-[#f5b000] text-center active:scale-[0.98] transition-all shadow-xl"
                            >
                                Go to Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}