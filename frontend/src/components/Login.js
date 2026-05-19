import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './Login.css'
import axios from "axios";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const API = "http://localhost:5000";

  const handleSubmit= async(event)=>{
   event.preventDefault();

    try {
      const res = await axios.post(
        `${API}/login`,
        { email, password },
        { withCredentials: true }
      );

      console.log(res.data);
      const token = res.data?.token;
      if (!token) {
        localStorage.removeItem("token");
        alert("Login failed: no authentication token was returned.");
        return;
      }
      localStorage.setItem("token", token);

      alert("Login Successful !");
      navigate('/Dashboard');
    } catch (error) {
      console.error("Signup Error:", error);
      alert(error.response?.data || "Login failed");
    }
  }


  
  return (
    <main className="auth-page">
      <section className="auth-hero">
        <p className="eyebrow">Civik reporting system</p>
        <h1>Welcome Back</h1>
        <p>Sign in to submit civic issues and follow updates from the dashboard.</p>
      </section>

      <section className="auth-card">
        <div className="auth-heading">
          <p className="eyebrow">Citizen access</p>
          <h2>Login</h2>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
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

          <button type="submit" className="auth-primary">Submit</button>
        </form>
      </section>
    </main>
  )
}

export default Login;
