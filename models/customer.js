import mongoose from "mongoose";
import timestamps from "mongoose-timestamp";

const { Schema } = mongoose;

export const CustomerSchema = new Schema(
  {
    name: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    subCategory: { type: String },
    password: { type: String },
    photoUrl: { type: String },
    recentSearches: [{ type: String }],
  },
  {
    collection: "customers",
  }
);

CustomerSchema.plugin(timestamps);

CustomerSchema.index({ createdAt: 1, updatedAt: 1 });

export const Customer = mongoose.model("Customer", CustomerSchema);
