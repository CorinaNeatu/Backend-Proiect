const mongoose = require("mongoose");


//code first
const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, unique: true },
    desc: { type: String},
    img: { type: String },
    categories: { type: Array },
    sizes: { type: Array },
    color: { type: String },
    price: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);