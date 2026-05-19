const mongoose = require("mongoose");
const userschema = new mongoose.Schema({
     name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["citizen", "staff", "admin"],
    default: "citizen"
  },

  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "department",
    default: null 
  },

  phone: {
    type: String,
  },

  address: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});




module.exports = mongoose.model("user",userschema);
