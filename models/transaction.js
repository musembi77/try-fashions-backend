import mongoose from "mongoose";
import timestamps from "mongoose-timestamp";

const { Schema } = mongoose;

export const TransactionSchema = new Schema(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order" },
    paymentMode: { type: String },
    paymentAmount: { type: Number },
    senderRef: { type: String },
  },
  {
    collection: "transactions",
  }
);

TransactionSchema.plugin(timestamps);

TransactionSchema.index({ createdAt: 1, updatedAt: 1 });

export const Transaction = mongoose.model("Transaction", TransactionSchema);
