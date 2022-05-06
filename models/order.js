import mongoose from "mongoose";
import timestamps from "mongoose-timestamp";

const { Schema } = mongoose;

export const OrderSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    customer: { type: Schema.Types.ObjectId, ref: "Customer" },
    quantity: { type: Number, default: 1 },
    size: { type: String },
    transaction: { type: Schema.Types.ObjectId, ref: "Transaction" },
    cancelled: { type: Boolean, default: false },
    paid: { type: Boolean, default: false },
    deliveryDate: { type: Date },
  },
  {
    collection: "orders",
  }
);

OrderSchema.plugin(timestamps);

OrderSchema.index({ createdAt: 1, updatedAt: 1 });

export const Order = mongoose.model("Order", OrderSchema);
