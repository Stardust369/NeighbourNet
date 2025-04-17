// import mongoose from "mongoose";

// const donationSchema = new mongoose.Schema(
//   {
//     donorName: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     email: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     amount: {
//       type: Number,
//       required: true
//     },
//     currency: {
//       type: String,
//       default: "INR"
//     },
//     message: {
//       type: String,
//       default: "Supporting a good cause"
//     },
//     orderId: {
//       type: String,
//       required: true
//     },
//     paymentId: {
//       type: String
//     },
//     status: {
//       type: String,
//       enum: ["created", "paid", "failed"],
//       default: "created"
//     },
//     issueId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Issue",
//       default: null
//     }
//   },
//   { timestamps: true }
// );

// export const Donation = mongoose.model("Donation", donationSchema);