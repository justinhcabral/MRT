import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWallet extends Document {
  userId: mongoose.Types.ObjectId;
  balance: number;
  currency: string;
  status: "ACTIVE" | "FROZEN";
  lastTransactionAt: Date;
}

const WalletSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: "PHP",
      enum: ["PHP"],
    },
    status: {
      type: String,
      enum: ["ACTIVE", "FROZEN"],
      default: "ACTIVE",
    },
    lastTransactionAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Wallet: Model<IWallet> =
  mongoose.models.Wallet || mongoose.model("Wallet", WalletSchema);
export default Wallet;
