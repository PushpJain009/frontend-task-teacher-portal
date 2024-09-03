import React, { useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";
import { Modal, Box, TextField, Button, InputAdornment } from "@mui/material";
import { User } from "lucide-react";
import SubjectIcon from "@mui/icons-material/Subject";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ArrowDropDownCircleRoundedIcon from "@mui/icons-material/ArrowDropDownCircleRounded";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const Home = ({ setIsAuthenticated }) => {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [mark, setMark] = useState("");
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setName("");
    setSubject("");
    setMark("");
    setSelectedStudentId(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAction = () => {
    setAnchorEl(null);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    padding: "4% 8%",
  };

  // Fetch all students
  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("TOKEN !:", token);
      const response = await axios.get("http://localhost:5000/api/students", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response", response);
      setData(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Add student
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/students",
        {
          name,
          subject,
          marks: mark,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchStudents();
      handleClose();
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  // Fetch student data by ID
  const fetchStudentById = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/students/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const student = response.data;
      setName(student.name);
      setSubject(student.subject);
      setMark(student.marks);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  // Update student
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/students/${selectedStudentId}`,
        {
          name,
          subject,
          marks: mark,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchStudents();
      handleClose();
    } catch (error) {
      console.error("Error updating student data:", error);
    }
  };

  // Delete student
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (selectedStudentId) {
        await axios.delete(
          `http://localhost:5000/api/students/${selectedStudentId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        fetchStudents();
        handleCloseAction();
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <div className="table-container">
      <nav style={{ backgroundColor: "#fff" }}>
        <div>
          <h3 className="logo">tailwebs.</h3>
        </div>
        <div className="nav-links">
          <span>Home</span>
          <span onClick={handleLogout} style={{ cursor: "pointer" }}>
            Logout
          </span>
        </div>
      </nav>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th style={{ borderLeft: "1px solid", borderRight: "1px solid" }}>
              Subject
            </th>
            <th
              style={{
                textAlign: "center",
                borderLeft: "1px solid",
                borderRight: "1px solid",
              }}
            >
              Mark
            </th>
            <th style={{ textAlign: "center" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>
                <div className="name-container">
                  <div className="avatar">{item.name?.charAt(0)}</div>
                  <span>{item.name}</span>
                </div>
              </td>
              <td>{item.subject}</td>
              <td style={{ textAlign: "center" }}>{item.marks}</td>
              <td style={{ textAlign: "center" }}>
                <div>
                  <ArrowDropDownCircleRoundedIcon
                    sx={{ cursor: "pointer" }}
                    onClick={(event) => {
                      setSelectedStudentId(item._id);
                      fetchStudentById(item._id);
                      handleClick(event);
                    }}
                  />
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseAction}
                    sx={{
                      "& .MuiPaper-root": {
                        borderRadius: 2,
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                        minWidth: 150,
                      },
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleCloseAction();
                        handleOpen();
                      }}
                    >
                      Edit
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleDelete();
                      }}
                    >
                      Delete
                    </MenuItem>
                  </Menu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-btn" onClick={handleOpen}>
        Add
      </button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <label className="label">Name</label>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" className="icon">
                  <User />
                </InputAdornment>
              ),
            }}
            margin="normal"
          />
          <label className="label">Subject</label>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" className="icon">
                  <SubjectIcon />
                </InputAdornment>
              ),
            }}
            margin="normal"
          />
          <label className="label">Mark</label>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Mark"
            value={mark}
            onChange={(e) => setMark(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" className="icon">
                  <BookmarkIcon />
                </InputAdornment>
              ),
            }}
            margin="normal"
          />
          <div style={{ textAlignLast: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={selectedStudentId ? handleUpdate : handleSubmit}
              sx={{
                mt: 3,
                bgcolor: "#333",
                width: "70%",
                padding: "12px",
                borderRadius: "0px",
              }}
            >
              {selectedStudentId ? "Update" : "Add"}
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Home;
