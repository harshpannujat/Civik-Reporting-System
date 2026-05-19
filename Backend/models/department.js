const mongoose = require("mongoose");
const departmentschema =  new mongoose.Schema({
     name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  description: {
    type: String,
    default: ""
  },
  head:{
    type:String
  },

  staff: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  }],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("department",departmentschema);
