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
    image1: { type: String },
    image2: { type: String },
    image3: { type: String },
    image4: { type: String },
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
