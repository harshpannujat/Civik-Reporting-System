import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './StaffSignup.css';
import API from "../config/api";
const StaffSignup = () => {
      const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setaddress] = useState("");
  const [password, setPassword] = useState("");
  const[departmentId,setdeptid]=useState("");
  const [role,setrole]=useState("");
  const [departments, setDepartments] = useState([]);
  const [departmentError, setDepartmentError] = useState("");
  const navigate = useNavigate();

  const handleSubmit= async(event)=>{
   event.preventDefault();
   
    try {
      if (!departmentId) {
        alert("Please select a department");
        return;
      }
      const res = await axios.post(
        `${API}/signup`,
        { name, email, password, address,role,departmentId},
        { withCredentials: true }
      );

      console.log(res.data);
      alert("Signup successful!");
      navigate('/login');
    } 
   catch (error) {
  console.error("Signup Error:", error);

  if (error.response) {
    alert(error.response.data);
  } else if (error.request) {
    alert("No response from server! Check your connection.");
  } else {
    alert("Unexpected error occurred");
  }
}

  }

 
  function navigationtologin(){
        navigate('/login');

  }

  useEffect(()=>{
    setrole("staff");
  },[]);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const response = await axios.get(`${API}/departments`);
        setDepartments(response.data);
        setDepartmentError("");
      } catch (error) {
        console.error("Department Load Error:", error);
        setDepartmentError("Unable to load departments");
      }
    };

    loadDepartments();
  }, []);
  
  return (
    <main className="auth-page">
      <section className="auth-hero">
        <p className="eyebrow">Civik reporting system</p>
        <h1>Staff Signup</h1>
        <p>Create a department account to review, route, and resolve reports from citizens.</p>
      </section>

      <section className="auth-card">
        <div className="auth-heading">
          <p className="eyebrow">Department access</p>
          <h2>Staff Signup</h2>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            <span>Full name</span>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </label>

          <label>
            <span>Email address</span>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              title="Please enter a valid email address"
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </label>

          <label>
            <span>Address</span>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setaddress(e.target.value)}
              placeholder="Enter your full address"
              required
            />
          </label>

          <label>
            <span>Department</span>
            <select
              id="departmentId"
              value={departmentId}
              onChange={(e) => setdeptid(e.target.value)}
              required
            >
              <option value="">Select your department</option>
              {departments.map((department) => (
                <option key={department._id} value={department._id}>
                  {department.name}
                </option>
              ))}
            </select>
          </label>
          {departmentError && <p className="form-error">{departmentError}</p>}

          <button type="submit" className="auth-primary">Submit</button>
        </form>
        <div className="auth-actions">
          <button type="button" className="auth-secondary" onClick={navigationtologin}>Login</button>
        </div>
      </section>
    </main>
  )
}

export default StaffSignup;
