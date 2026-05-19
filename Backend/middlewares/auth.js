const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SECRET;

const auth = async(req,res,next)=>{
    try {
        let token = req.headers.authorization;
        if(!token || !token.startsWith("Bearer")){
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        token = token.split(" ")[1];
        const user = jwt.verify(token,secret);
        req.user = user;
        next();
    } catch (error) {
                return res.status(401).json({ message: "Unauthorized User", error: error.message });

    }
};
module.exports = auth;