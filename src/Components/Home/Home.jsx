import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Avatar,
  AppBar,
  Toolbar,
  InputAdornment,
} from "@mui/material";
import { User } from "lucide-react";
import SubjectIcon from "@mui/icons-material/Subject";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import ArrowDropDownCircleRoundedIcon from "@mui/icons-material/ArrowDropDownCircleRounded";

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

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/students", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <AppBar position="static" color="default">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" color="red">
            tailwebs.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button color="inherit">Home</Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="center">Subject</TableCell>
                  <TableCell align="center">Mark</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ bgcolor: "#2196F3" }}>
                            {item.name?.charAt(0)}
                          </Avatar>
                          <Typography>{item.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">{item.subject}</TableCell>
                      <TableCell align="center">{item.marks}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={(event) => {
                            setSelectedStudentId(item._id);
                            fetchStudentById(item._id);
                            handleClick(event);
                          }}
                        >
                          <ArrowDropDownCircleRoundedIcon
                            sx={{ borderRadius: "50%", color: "#333" }}
                          />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleCloseAction}
                          PaperProps={{
                            elevation: 1,
                            sx: {
                              "& .MuiMenuItem-root": {
                                minHeight: "32px",
                                minWidth: "150px",
                              },
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
                          <MenuItem onClick={handleDelete}>Delete</MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No Student Data
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: "flex", justifyContent: "start", mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleOpen}
              sx={{
                backgroundColor: "#333",
                "&:hover": {
                  backgroundColor: "#555",
                },
              }}
            >
              Add Student
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedStudentId ? "Update Student" : "Add Student"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={2}>
            <TextField
              fullWidth
              variant="outlined"
              label="Name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <User />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Subject"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SubjectIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Mark"
              placeholder="Mark"
              value={mark}
              onChange={(e) => setMark(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BookmarkBorderOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={selectedStudentId ? handleUpdate : handleSubmit}
            color="primary"
            variant="contained"
            sx={{
              backgroundColor: "#333",
              "&:hover": {
                backgroundColor: "#555",
              },
            }}
          >
            {selectedStudentId ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;
