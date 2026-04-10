import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: [true, "User name is required."] },
    email: {
      type: String,
      required: [true, "User email is required."],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    },
    password: {
      type: String,
      required: [true, "User password is required."],
      minLength: [6, "Password must be at least 6 characters long."]
    },
    role: {
      type: String,
      enum: ["STUDENT", "TEACHER", "ADMIN"],
      default: "STUDENT",
    },
    profilePicture: { type: String, default: "" },
    bio: { type: String, default: "" },
    department: { type: String, default: "" },
    year: { type: String, default: "" },
    classSection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClassSection',
      default: null
    },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date }
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
