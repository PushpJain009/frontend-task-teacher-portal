import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Paper,
} from "@mui/material";
import { User, LockKeyholeOpen } from "lucide-react";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import axios from "axios";

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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f0f0f0",
      }}
    >
      <Typography variant="h2" sx={{ color: "#e74c3c", mb: 4 }}>
        tailwebs.
      </Typography>
      <Paper elevation={3} sx={{ padding: 4, width: 350 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            placeholder="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <User />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="New Password"
            placeholder="New Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type={passwordVisible ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockKeyholeOpen />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? (
                      <VisibilityOffOutlinedIcon />
                    ) : (
                      <RemoveRedEyeOutlinedIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box textAlign="right" mb={2}>
            <Link
              to="/login"
              style={{ textDecoration: "none", color: "#3498db" }}
            >
              Back to Login
            </Link>
          </Box>
          {error && <Typography color="error">{error}</Typography>}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              padding: 2,
              backgroundColor: "#333",
              "&:hover": { backgroundColor: "#555" },
            }}
          >
            Reset Password
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
