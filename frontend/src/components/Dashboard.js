import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setimage] = useState("");
  const [location, setlocation] = useState("");
  const [departmentId, setSelectedDept] = useState("");
  const [department, setdepartment] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState("");

  const API = "http://localhost:5000";
  const token = localStorage.getItem("token");
  const isAuthenticated = Boolean(token && token !== "undefined" && token !== "null");

  const getErrorMessage = (error, fallback) => {
    const data = error.response?.data;
    if (typeof data === "string") return data;
    if (data?.message) return data.message;
    return fallback;
  };

  const handleAuthFailure = () => {
    localStorage.removeItem("token");
    setNotice("Your session is missing or expired. Please log in again before submitting a report.");
  };

  useEffect(() => {
    if (!isAuthenticated) {
      handleAuthFailure();
      return;
    }

    axios.get(`${API}/reports`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    })
      .then(res => {
        console.log(res);
        setReports(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error(err);
        if (err.response?.status === 401) {
          handleAuthFailure();
        }
      });
  }, [isAuthenticated, token]);

  useEffect(() => {
    const getalldepartments = async () => {
      try {
        const response = await axios.get(`${API}/departments`, {
          withCredentials: true
        });
        console.log(response);
        setdepartment(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.log(error);
      }
    };

    getalldepartments();
  }, []);

  const handleinput = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "civik-reporting-system");
      data.append("cloud_name", "dbihbtvyz");

      const res = await fetch("https://api.cloudinary.com/v1_1/dbihbtvyz/image/upload", {
        method: "POST",
        body: data
      });

      const uploaded = await res.json();
      if (!res.ok || !uploaded.secure_url) {
        throw new Error(uploaded.error?.message || "Image upload failed");
      }
      setimage(uploaded.secure_url);
    } catch (error) {
      console.error("Image upload failed:", error);
      setimage("");
      alert("Image upload failed. You can submit the report without an image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice("");
    if (!isAuthenticated) {
      handleAuthFailure();
      return;
    }
    if (uploading) {
      setNotice("Image is still uploading. Please wait a second before submitting.");
      return;
    }
    if (!departmentId) {
      setNotice("Please choose a department for this report.");
      return;
    }
    try {
      const res = await axios.post(
        `${API}/reportissue`,
        { title, description, image, location: { address: location }, departmentId },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );

      setReports(prev => [res.data.report, ...prev]);
      setNotice("Report submitted successfully. Your department can now review it.");
      setTitle("");
      setDescription("");
      setlocation("");
      setSelectedDept("");
      setimage("");
    } catch (error) {
      console.error("Error submitting report:", error);
      if (error.response?.status === 401) {
        handleAuthFailure();
        return;
      }
      setNotice(getErrorMessage(error, "Failed to submit report. Please check the details and try again."));
    }
  };

  const total = reports.length;
  const resolved = reports.filter(r => r.status === "resolved").length;
  const pending = reports.filter(r => r.status === "pending").length;
  const active = reports.filter(r => r.status === "in-progress").length;
  const selectedDepartment = department.find(dept => dept._id === departmentId);

  return (
    <div className="dashboard-container">
      <header className="dashboard-hero">
        <div>
          <p className="eyebrow">Civik reporting system</p>
          <h1>Citizen Dashboard</h1>
          <p className="hero-copy">
            Report civic issues, route them to the right department, and track every update in one place.
          </p>
        </div>
        <button className="secondary-action" type="button" onClick={() => navigate("/login")}>
          Login
        </button>
      </header>

      {notice && (
        <div className={`notice ${notice.includes("successfully") ? "success" : ""}`}>
          <span>{notice}</span>
          {!isAuthenticated && (
            <button type="button" onClick={() => navigate("/login")}>
              Go to login
            </button>
          )}
        </div>
      )}

      <div className="summary">
        <div className="summary-card">
          <span>Total Reports</span>
          <p>{total}</p>
        </div>
        <div className="summary-card">
          <span>Pending</span>
          <p>{pending}</p>
        </div>
        <div className="summary-card">
          <span>In Progress</span>
          <p>{active}</p>
        </div>
        <div className="summary-card">
          <span>Resolved</span>
          <p>{resolved}</p>
        </div>
      </div>

      <section className="report-form">
        <div className="section-heading">
          <div>
            <p className="eyebrow">New issue</p>
            <h2>Submit a Report</h2>
          </div>
          {selectedDepartment && <span className="dept-chip">{selectedDepartment.name}</span>}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              <span>Report title</span>
              <input
                type="text"
                placeholder="Street light not working"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>
            <label>
              <span>Department</span>
              <select
                value={departmentId}
                onChange={(e) => setSelectedDept(e.target.value)}
                required
              >
                <option value="">Choose department</option>
                {department.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            <span>Description</span>
            <textarea
              placeholder="Describe the issue, nearby landmark, and urgency"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>

          <label>
            <span>Location</span>
            <input
              placeholder="Full address or nearby landmark"
              value={location}
              onChange={(e) => setlocation(e.target.value)}
              required
            />
          </label>

          <label className="file-upload" htmlFor="fileUpload">
            <span>{image ? "Image attached" : "Attach an optional photo"}</span>
            <strong>{uploading ? "Uploading..." : "Choose image"}</strong>
            <input type="file" id="fileUpload" name="file" accept="image/*" onChange={handleinput} />
          </label>

          <button className="primary-action" type="submit" disabled={uploading || !isAuthenticated}>
            {uploading ? "Uploading Image" : "Submit Report"}
          </button>
        </form>
      </section>

      <section className="reports-list">
        <div className="section-heading">
          <div>
            <p className="eyebrow">History</p>
            <h2>My Reports</h2>
          </div>
        </div>
        {reports.length === 0 ? (
          <div className="empty-state">
            <h3>No reports submitted yet</h3>
            <p>Your submitted reports will appear here with their latest status.</p>
          </div>
        ) : (
          <ul>
            {reports.map((report) => (
              <li key={report._id} className={`report-item ${report.status}`}>
                <div>
                  <h3>{report.title}</h3>
                  <p>{report.description}</p>
                  <small>{report.departmentId?.name || "Department not assigned"}</small>
                </div>
                <span>{report.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
