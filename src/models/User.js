import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return this.authMethod === "credentials";
      }, // 🔹 Пароль тільки для email/пароля
    },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    nickname: {
      type: String,
      unique: true,
      sparse: true,
      validate: {
        validator: (v) => !v || /^[a-zA-Z0-9_]+$/.test(v),
        message: (props) => `${props.value} is not a valid nickname!`,
      },
    },
    avatar: {
      type: String,
      default: "/public/default-avatar.png",
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
    authMethod: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

delete mongoose.models.User; // 🔹 Видаляємо кешовану модель
export default mongoose.models.User || mongoose.model("User", UserSchema);
