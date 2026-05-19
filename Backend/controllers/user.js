const generatetoken = require('../config/generatetoken');
const User = require('../models/user');
const Report = require('../models/report');
const Department = require('../models/department');
const mongoose = require("mongoose");

const signup = async(req,res)=>{
    const {name,email,password,role = "citizen",departmentId,phone,address} = req.body;
    const normalizedRole = role || "citizen";
        if(!name || !email || !password || !address ){
            res.status(400).json('Please enter required fields');
            return ;
        }
        try{
    const alreadyexist = await User.findOne({email});
    if(alreadyexist){
  return res.status(400).json("user already exist");
    }

    if(normalizedRole=="staff"){
          if (!departmentId) {
        return res.status(400).json("Department ID is required for staff");
        
    }
        if (!mongoose.Types.ObjectId.isValid(departmentId)) {
            return res.status(400).json("Invalid department ID format");
        }
        const department = await Department.findById(departmentId);
        if(!department){
            return res.status(400).json("Department not found");
        }
        
    }
    const user = await User.create({
        name,
        email,
        password,
        role: normalizedRole,
        departmentId: normalizedRole === "staff" ? departmentId : null,
        phone,
        address
    });

    if (normalizedRole === "staff") {
        await Department.findByIdAndUpdate(departmentId, { $addToSet: { staff: user._id } });
    }
    
     res.status(200).json(
      {  name,
        email,
        role: normalizedRole,
        departmentId: user.departmentId,
        phone,
        address,
        token : generatetoken(user._id, normalizedRole, user.departmentId)
      }
   
    );
       return;
    
        }
        catch(error){
            console.log(error);
            res.status(500).json("Signup failed");
        }
};

const login = async(req,res)=>{
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json("Please enter all fields");
    }
    try{

    const user = await User.findOne({email});
    if(user){
        if(password == user.password){
       res.status(200).json({
        id:user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        departmentId: user.departmentId,
        phone: user.phone,
        address: user.address,
        token: generatetoken(user._id, user.role,user.departmentId)
               });

       }
        else{
            return res.status(401).json("Invalid email or password");
        }
    }
    else{
        return res.status(404).json("No user exists with this email");
    }
}
catch(error){
    res.status(500).json("Login failed");
}
};

const generateReport = async (req,res) => {
        const {title,description,location,image,departmentId} = req.body;
        let citizenId = req.user.id;
        
        if(!title || !description || !location || !citizenId || !departmentId){
            return res.status(400).json("Provided detail is not enough");
        }
        try{
        if (!mongoose.Types.ObjectId.isValid(departmentId)) {
            return res.status(400).json("Invalid department ID format");
        }

        const department = await Department.findById(departmentId);
        if (!department) {
            return res.status(400).json("Department not found");
        }

        const reportLocation = typeof location === "string"
            ? { address: location }
            : location;

        const report =await  Report.create({
            title,
            description,
            location: reportLocation,
            image,
            departmentId,
            citizenId
        });
        if(report){
            return res.status(200).json({report});
        }
   
    }
    catch(error){
        res.status(400).json(error.message || error);
    }
        
};


const getreports = async (req,res) => {
    const id = req.user.id;
    
    try {
        if(req.user.role!="staff"){
        const allreports = await Report.find({citizenId: id }).populate("citizenId", "name email")
        .populate("departmentId", "name");
         if(!allreports){
            res.status(200).json("NO REPORT FOUND");
        return;
        }
                return res.status(200).json(allreports)

        }
        else{
const allreports = await Report.find({ departmentId: req.user.departmentId }).populate("citizenId", "name email")
        .populate("departmentId", "name");

  if(!allreports){
            res.status(200).json("NO REPORT FOUND");
        return;
        }
                return res.status(200).json(allreports);

        }
        
    } catch (error) {
        res.json(error);
    }
};

const deleteReport = async (req, res) => {
  const reportId = req.params.id;   
  const userId = req.user.id;       

  try {
    const report = await Report.findById(reportId);

    if (!report) {
         return res.status(404).json({ message: "Report not found" });
    }
    if (report.citizenId.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this report" });
    }

        await Report.findByIdAndDelete(reportId);

        res.status(200).json({ message: "Report deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updatestatus = async (req, res) => {
    const { status } = req.params;  
    const { id } = req.body;        

    try {
        if (req.user.role !== "staff") {
            return res.status(403).json({ message: "Access denied: Only staff can update status" });
        }

        const report = await Report.findByIdAndUpdate(
            id,
            { status: status },
            { new: true }     
        );

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        return res.status(200).json({
            message: "Status updated successfully",
            report
        });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};


const createdepartment= async (req,res) => {
        const {name,description,head} = req.body;
        
        try {

        if(req.user.role!='admin'){
            return res.status(400).json("Only admin can create Departments");
        }
        if(!name || !name.trim()){
            return res.status(400).json("Department name is required");
        }

        const normalizedName = name.trim();
        const existingdept = await Department.findOne({name: normalizedName});
        if(existingdept){
            return res.status(400).json("Department already exist");
        }  


        const newdepartment  = await Department.create({
            name: normalizedName,
            description,
            head
        });
                return res.status(200).json(newdepartment);

    }
        
catch (error) {
          return res.status(400).json(error.message || error);
        }

};
 const getdepartment =async (req,res) => {
    try {
        const alldepartments = await Department.find();
        return res.status(200).json(alldepartments);

    } catch (error) {
        return res.json(error);
    }
 }

module.exports = {signup,login,generateReport,getreports,deleteReport,createdepartment,updatestatus,getdepartment};
