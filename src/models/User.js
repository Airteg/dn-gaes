import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    nickname: {
      type: String,
      unique: true,
      sparse: true, // Уникнення помилок з унікальністю, якщо поле порожнє
      validate: {
        validator: (v) => !v || /^[a-zA-Z0-9_]+$/.test(v),
        message: (props) => `${props.value} is not a valid nickname!`,
      },
    },
    avatar: {
      type: String,
      default: "/public/default-avatar.png", // Дефолтний аватар
    },
    position: { type: String },
    placeOfWork: { type: String },
    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["pending", "active", "rejected"],
      default: "pending",
    },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false }, // "М'яке видалення" користувача
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
