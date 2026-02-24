import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        otp: {
            type: String,
            required: true
        },
        expireAt: {
            type: Date,
            required: true,
            index: { expires: 0 } // TTL index - document auto-deletes when expireAt time is reached
        }
    },
    { timestamps: true }
);

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;