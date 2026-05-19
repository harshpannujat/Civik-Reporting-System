const mongoose = require("mongoose");
const reportschema =  new mongoose.Schema({
    title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true
  },

  citizenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },

  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "department",
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "in-progress", "resolved", "rejected"],
    default: "pending"
  },

  location: {
    address: String,
    latitude: Number,
    longitude: Number
  },

  image: {
    type: String, 
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports =  mongoose.model("report",reportschema);
