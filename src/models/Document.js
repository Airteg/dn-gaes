import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String },
    filePath: { type: String, required: true },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Хто завантажив документ
    isArchived: { type: Boolean, default: false }, // Якщо true — не показується у загальному списку
    shareholdersOnly: { type: Boolean, default: false }, // Якщо true — доступно тільки акціонерам
    isDeleted: { type: Boolean, default: false }, // Якщо true — документ позначено як видалений
  },
  { timestamps: true },
);

export default mongoose.models.Document ||
  mongoose.model("Document", DocumentSchema);
