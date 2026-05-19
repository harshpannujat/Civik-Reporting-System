const express = require("express");
const Router = express.Router();
const {signup, login, generateReport, getreports, deleteReport, createdepartment, updatestatus, getdepartment} = require('../controllers/user');
const auth = require('../middlewares/auth');
Router.get('/',(req,res)=>{
    res.send("Backend Running");
});
Router.post('/signup',signup);
Router.post('/login',login);
Router.post('/reportissue',auth,generateReport);
Router.get('/reports',auth,getreports);
Router.delete('/reports/:id',auth,deleteReport);
Router.post('/createdepartment',auth,createdepartment);
Router.get('/departments',getdepartment);
Router.put('/updatestatus/:status',auth,updatestatus);



module.exports = Router;
