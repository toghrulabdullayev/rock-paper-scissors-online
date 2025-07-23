import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    // Public info
    profileImage: {
      type: String,
      default: null,
    },
    displayName: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: "I have yet to fill in my bio",
    },
    stats: {
      wins: { type: Number, default: 0 },
      ties: { type: Number, default: 0 },
      losses: { type: Number, default: 0 },
    },

    // Password reset
    otp: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
