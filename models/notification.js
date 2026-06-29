import mongoose from "mongoose";

const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    role: { type: String, enum: ["user", "seller", "admin"], required: false },

    // A simple generic payload
    title: { type: String, required: false, trim: true },
    message: { type: String, required: false, trim: true },

    read: { type: Boolean, default: false },

    // optional reference to entities (order, payment, etc.)
    entityType: { type: String, required: false, trim: true },
    entityId: { type: Schema.Types.ObjectId, required: false },
  },
  { timestamps: true },
);

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;
