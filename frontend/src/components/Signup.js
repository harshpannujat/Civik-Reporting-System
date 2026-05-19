import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import axios from "axios";

const Signup = () => {
      const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setaddress] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const API = "http://localhost:5000";

  const handleSubmit= async(event)=>{
   event.preventDefault();

    try {
      const res = await axios.post(
        `${API}/signup`,
        { name, email, password, address },
        { withCredentials: true }
      );

      console.log(res.data);
      alert("Signup successful!");
      navigate('/login');
    } catch (error) {
      console.error("Signup Error:", error);
      alert(error.response?.data || "Signup failed");
    }
  }

  function navigation(){
    navigate('/staff/signup');
  }
  function navigationtologin(){
        navigate('/login');

  }
  
  return (
    <main className="auth-page">
      <section className="auth-hero">
        <p className="eyebrow">Civik reporting system</p>
        <h1>Create Account</h1>
        <p>Join the dashboard to report local issues and keep every update easy to track.</p>
      </section>

      <section className="auth-card">
        <div className="auth-heading">
          <p className="eyebrow">Citizen access</p>
          <h2>Signup</h2>
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
              pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
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

          <button type="submit" className="auth-primary">Submit</button>
        </form>
        <div className="auth-actions">
          <button type="button" className="auth-secondary" onClick={navigation}>Signup as a Service Provider</button>
          <button type="button" className="auth-secondary" onClick={navigationtologin}>Login</button>
        </div>
      </section>
    </main>
  )
}

export default Signup;
