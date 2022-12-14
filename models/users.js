import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  phone: {
    type: Number,
  },
  password: {
    type: String,
  },
  order: {
    type: Array,
  },
  final_order: {
    type: Array,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  address: {
    type: Object,
  },
  token: { type: String },
});

export default mongoose.model("User", userSchema);
