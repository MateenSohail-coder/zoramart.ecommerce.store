import mongoose from "mongoose";
import slugify from "slugify";
const categoriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    level: {
      type: Number,
      enum: [1, 2, 3],
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);
categoriesSchema.index({ parentCategory: 1 });
categoriesSchema.index({ level: 1 });
categoriesSchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
});

export default mongoose.models.Category ||
  mongoose.model("Category", categoriesSchema);
