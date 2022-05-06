import mongoose from "mongoose";
import timestamps from "mongoose-timestamp";

const { Schema } = mongoose;

export const ReviewSchema = new Schema(
  {
    message: { type: String },
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    customer: { type: Schema.Types.ObjectId, ref: "Customer" },
  },
  {
    collection: "reviews",
  }
);

ReviewSchema.plugin(timestamps);

ReviewSchema.index({ createdAt: 1, updatedAt: 1 });

export const Review = mongoose.model("Review", ReviewSchema);
