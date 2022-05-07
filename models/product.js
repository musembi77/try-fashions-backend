import mongoose from "mongoose";
import timestamps from "mongoose-timestamp";

const { Schema } = mongoose;

export const ProductSchema = new Schema(
  {
    name: { type: String },
    category: { type: String },
    price: { type: Number },
    subCategory: { type: String },
    colors: [{ type: String }],
    sizes: [{ type: String }],
    previousPrice: { type: Number },
    image1: String,
    image2: String,
    image3: String,
    image4: String,
    description: { type: String },
    showPreviousPrice: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
  },
  {
    collection: "products",
  }
);

ProductSchema.plugin(timestamps);

ProductSchema.index({ createdAt: 1, updatedAt: 1 });

export const Product = mongoose.model("Product", ProductSchema);
