import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
    },
  ],
  payment: {},
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  status: {
    type: String,
    default: "Not Process",
    enum: ["Not Process", "Processing", "Shipped", "deliverd", "cancel"],
  },
});
export default mongoose.model("Order", OrderSchema);
