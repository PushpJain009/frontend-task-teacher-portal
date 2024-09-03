import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { User } from "lucide-react";
import { LockKeyholeOpen } from "lucide-react";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import axios from "axios"; // Import axios

const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        {
          username,
          newPassword,
        }
      );

      if (response.status === 200) {
        navigate("/login");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <h2 className="logo">tailwebs.</h2>
      <div className="login-box">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <div className="input-icon-container">
              <User className="input-icon" />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="input-icon-container">
              <LockKeyholeOpen className="input-icon" />
              <input
                type={passwordVisible ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
              />
              <span
                className="toggle-password"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? (
                  <VisibilityOffOutlinedIcon className="visibility-icon" />
                ) : (
                  <RemoveRedEyeOutlinedIcon className="visibility-icon" />
                )}
              </span>
            </div>
          </div>
          <div className="forgot-password">
            <a href="/login">Back to Login</a>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
