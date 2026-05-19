const express = require("express");
const  dotenv = require("dotenv");
const mongoose=require("mongoose");
const User = require('./models/user');
const cors=  require("cors");
dotenv.config();
const app = express();
const Routes= require('./routes/user');

const allowedOrigins = [
  'http://localhost:3000',
  'https://civik-reporting-system-wko8.onrender.com',
  ...(process.env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => origin.trim())
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

app.use('/',Routes);



mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ Error:", err));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on ${port}`));


