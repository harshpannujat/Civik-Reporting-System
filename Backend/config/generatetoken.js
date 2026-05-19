const jwt = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.JWT_SECRET;

const generatetoken = (id, role, departmentId = null) => {
  return jwt.sign(
    { id, role, departmentId }, // now safe for citizens too
    secret,
    { expiresIn: "30d" }
  );
};

module.exports = generatetoken;
