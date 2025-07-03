// src/pages/AttendancePage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Paper,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Avatar,
  CssBaseline,
  ThemeProvider,
  createTheme
} from "@mui/material";
import { 
  CheckCircle, 
  Error, 
  Close, 
  Check, 
  Person, 
  School, 
  Badge, 
  Phone, 
  Flag, 
  Assignment 
} from "@mui/icons-material";
import { styled } from "@mui/system";

// Create theme with Cairo font
const theme = createTheme({
  typography: {
    fontFamily: '"Cairo", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontSize: '1.1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Cairo", sans-serif',
          fontWeight: 600,
          textTransform: 'none',
          letterSpacing: '0.5px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily: '"Cairo", sans-serif',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontFamily: '"Cairo", sans-serif',
        },
      },
    },
  },
});

// Styled Components
const ProfessionalCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: '950px',
  margin: '0 auto',
  padding: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0 12px 35px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)'
  }
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #1976d2, #2196f3)',
  color: 'white',
  fontWeight: 600,
  letterSpacing: '0.5px',
  padding: '14px 28px',
  borderRadius: '10px',
  fontSize: '16px',
  boxShadow: '0 4px 8px rgba(25, 118, 210, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 16px rgba(25, 118, 210, 0.3)',
    background: 'linear-gradient(45deg, #1565c0, #1e88e5)'
  }
}));

const SuccessButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #4caf50, #2e7d32)',
  color: 'white',
  fontWeight: 600,
  letterSpacing: '0.5px',
  padding: '14px 28px',
  borderRadius: '10px',
  fontSize: '16px',
  boxShadow: '0 4px 8px rgba(76, 175, 80, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 16px rgba(76, 175, 80, 0.3)',
    background: 'linear-gradient(45deg, #388e3c, #1b5e20)'
  }
}));

const ErrorButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #f44336, #d32f2f)',
  color: 'white',
  fontWeight: 600,
  letterSpacing: '0.5px',
  padding: '14px 28px',
  borderRadius: '10px',
  fontSize: '16px',
  boxShadow: '0 4px 8px rgba(244, 67, 54, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 16px rgba(244, 67, 54, 0.3)',
    background: 'linear-gradient(45deg, #e53935, #c62828)'
  }
}));

const AttendancePage = () => {
  const [studentId, setStudentId] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState({
    level: "",
    diploma: "",
    course: "",
    confirmed: false
  });

  // Add this near the top of your AttendancePage component (with other state declarations)
const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("user");
  navigate("/"); // Redirect to login/dashboard page
};

  // Sample data for select options
  const levels = ["المستوى الأول", "المستوى الثاني", "المستوى الثالث", "المستوى الرابع"];
  const diplomas = ["دبلوم الحاسب الآلي", "دبلوم الشبكات", "دبلوم البرمجة"];
  const courses = ["أساسيات الحاسب", "شبكات الحاسب", "برمجة الويب"];

  const handleAttendance = async () => {
    if (!studentId) {
      setError("يرجى إدخال رقم الهوية");
      setSnackbarOpen(true);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://192.168.50.170:5275/api/student/${studentId}`);
      if (!response.ok) {
        throw new Error("لم يتم العثور على الطالب");
      }
      const data = await response.json();
      setStudentData(data);
      setSuccess(true);
    } catch (error) {
      setError("لم يتم العثور على الطالب");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleReset = () => {
    setStudentData(null);
    setStudentId("");
    setSuccess(false);
  };

  const handleOpenAttendanceDialog = () => {
    setAttendanceDialogOpen(true);
  };

  const handleCloseAttendanceDialog = () => {
    setAttendanceDialogOpen(false);
  };

  const handleAttendanceSubmit = () => {
    // Submit attendance data to API
    console.log("Attendance submitted:", attendanceData);
    setAttendanceDialogOpen(false);
    setSnackbarOpen(true);
    setError(null);
  };

  const handleAttendanceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAttendanceData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          textAlign: "right",
          width: "100%",
          margin: "0 auto",
          padding: { xs: "20px", md: "40px" },
          backgroundColor: "#f5f7fa",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          fontFamily: '"Cairo", sans-serif'
        }}
      >
        <ProfessionalCard>
          {!studentData ? (
            <Box>
              <Box sx={{ textAlign: "center", mb: 5 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    margin: '0 auto 15px',
                    bgcolor: '#1976d2',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                  }}
                >
                  <Assignment sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography 
                  variant="h4"
                  sx={{ 
                    fontWeight: 700,
                    color: "#2c3e50",
                    position: "relative",
                    "&:after": {
                      content: '""',
                      display: "block",
                      width: "80px",
                      height: "4px",
                      background: "linear-gradient(45deg, #1976d2, #2196f3)",
                      margin: "15px auto 0",
                      borderRadius: "2px"
                    }
                  }}
                >
                  تسجيل الحضور
                </Typography>
              </Box>

            <TextField
  label="أدخل رقم الهوية"
  variant="outlined"
  fullWidth
  value={studentId}
  onChange={(e) => {
    const value = e.target.value;

    // Validation to ensure only numbers, does not start with 0, and has exactly 10 digits
    const isValid = /^[1-9][0-9]{0,9}$/.test(value) && value.length <= 10;

    // Set the value if it's valid, otherwise keep the old value
    if (isValid || value === "") {
      setStudentId(value);
    }
  }}
  sx={{
    marginBottom: "30px",
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#dfe6e9",
      },
      "&:hover fieldset": {
        borderColor: "#1976d2",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#1976d2",
      }
    }
  }}
  InputProps={{
    style: {
      fontSize: "1.1rem",
      fontFamily: '"Cairo", sans-serif'
    }
  }}
  InputLabelProps={{
    style: {
      fontSize: "1rem",
      fontFamily: '"Cairo", sans-serif'
    }
  }}
/>


              <GradientButton
                fullWidth
                onClick={handleAttendance}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "عرض بيانات الطالب"
                )}
              </GradientButton>
            </Box>
          ) : (
            <Box>
              <Box sx={{ textAlign: "center", mb: 5 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    margin: '0 auto 15px',
                    bgcolor: '#4caf50',
                    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
                  }}
                >
                  <CheckCircle sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography 
                  variant="h4"
                  sx={{ 
                    fontWeight: 700,
                    color: "#2c3e50",
                    position: "relative",
                    "&:after": {
                      content: '""',
                      display: "block",
                      width: "80px",
                      height: "4px",
                      background: "linear-gradient(45deg, #4caf50, #2e7d32)",
                      margin: "15px auto 0",
                      borderRadius: "2px"
                    }
                  }}
                >
                  بيانات الطالب
                </Typography>
              </Box>

               <Paper
  sx={{
    padding: { xs: "20px", md: "30px" },
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    marginBottom: "30px",
    borderLeft: "4px solid #1976d2",
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden'
  }}
>
  <Box 
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
      gap: '20px'
    }}
  >
    {/* Student Information Rows */}
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      borderRight: { md: '1px solid #e0e0e0' },
      paddingRight: { md: '20px' }
    }}>
      {/* Name */}
      <Box sx={{
        display: 'flex',
        alignItems: 'flex-start',
        padding: '12px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <Person color="primary" sx={{ mr: 2, fontSize: 24, flexShrink: 0 }} />
        <Box>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: 600, 
            color: "#1976d2",
            fontSize: '0.875rem',
            mb: 0.5
          }}>
            الاسم الكامل
          </Typography>
          <Typography variant="body1" sx={{ 
            fontWeight: 500,
            fontSize: '1rem'
          }}>
            {studentData.studentName}
          </Typography>
        </Box>
      </Box>

      {/* National ID */}
      <Box sx={{
        display: 'flex',
        alignItems: 'flex-start',
        padding: '12px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <Badge color="primary" sx={{ mr: 2, fontSize: 24, flexShrink: 0 }} />
        <Box>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: 600, 
            color: "#1976d2",
            fontSize: '0.875rem',
            mb: 0.5
          }}>
            رقم الهوية
          </Typography>
          <Typography variant="body1" sx={{ 
            fontWeight: 500,
            fontSize: '1rem'
          }}>
            {studentData.nationalId}
          </Typography>
        </Box>
      </Box>

      {/* Phone */}
      <Box sx={{
        display: 'flex',
        alignItems: 'flex-start',
        padding: '12px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <Phone color="primary" sx={{ mr: 2, fontSize: 24, flexShrink: 0 }} />
        <Box>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: 600, 
            color: "#1976d2",
            fontSize: '0.875rem',
            mb: 0.5
          }}>
            رقم الجوال
          </Typography>
          <Typography variant="body1" sx={{ 
            fontWeight: 500,
            fontSize: '1rem'
          }}>
            {studentData.studentTel}
          </Typography>
        </Box>
      </Box>
    </Box>

    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      paddingLeft: { md: '20px' }
    }}>
      {/* Student Type */}
      <Box sx={{
        display: 'flex',
        alignItems: 'flex-start',
        padding: '12px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <School color="primary" sx={{ mr: 2, fontSize: 24, flexShrink: 0 }} />
        <Box>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: 600, 
            color: "#1976d2",
            fontSize: '0.875rem',
            mb: 0.5
          }}>
            نوع الطالب
          </Typography>
          <Typography variant="body1" sx={{ 
            fontWeight: 500,
            fontSize: '1rem'
          }}>
            {studentData.studentType === "0" ? "ذكر" : "مؤنث"}
          </Typography>
        </Box>
      </Box>

      {/* Nationality */}
      <Box sx={{
        display: 'flex',
        alignItems: 'flex-start',
        padding: '12px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <Flag color="primary" sx={{ mr: 2, fontSize: 24, flexShrink: 0 }} />
        <Box>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: 600, 
            color: "#1976d2",
            fontSize: '0.875rem',
            mb: 0.5
          }}>
            الجنسية
          </Typography>
          <Typography variant="body1" sx={{ 
            fontWeight: 500,
            fontSize: '1rem'
          }}>
            {studentData.studentNational === "0" ? "مواطن" : "مقيم"}
          </Typography>
        </Box>
      </Box>

      {/* Additional Info (if needed) */}
      <Box sx={{
        display: 'flex',
        alignItems: 'flex-start',
        padding: '12px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <Assignment color="primary" sx={{ mr: 2, fontSize: 24, flexShrink: 0 }} />
        <Box>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: 600, 
            color: "#1976d2",
            fontSize: '0.875rem',
            mb: 0.5
          }}>
            الحالة
          </Typography>
          <Typography variant="body1" sx={{ 
            fontWeight: 500,
            fontSize: '1rem'
          }}>
              مستمر
          </Typography>
        </Box>
      </Box>
    </Box>
  </Box>
</Paper>

              <Box sx={{ display: "flex", gap: 2 }}>
                <SuccessButton
                  fullWidth
                  onClick={handleOpenAttendanceDialog}
                >
                  سجل الحضور
                </SuccessButton>
                <ErrorButton
                  fullWidth
                  onClick={handleReset}
                >
                  العودة
                </ErrorButton>
              </Box>
            </Box>
          )}
        </ProfessionalCard>

        {/* Attendance Registration Dialog */}
         <Dialog
  open={attendanceDialogOpen}
  onClose={handleCloseAttendanceDialog}
  maxWidth="md"  // Changed from "sm" to "md" for larger dialog
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: "20px",
      padding: { xs: "20px", md: "30px" },
      fontFamily: '"Cairo", sans-serif',
      background: "#ffffff",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
      border: "1px solid rgba(0, 0, 0, 0.05)"
    }
  }}
>
  <Box sx={{ textAlign: "center", mb: 3 }}>
    <Avatar
      sx={{
        width: 70,
        height: 70,
        margin: "0 auto 15px",
        bgcolor: "#4caf50",
        boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)"
      }}
    >
      <Assignment sx={{ fontSize: 32 }} />
    </Avatar>
    <DialogTitle
      sx={{
        fontWeight: 700,
        fontSize: "1.8rem",
        color: "#2c3e50",
        padding: 0,
        position: "relative",
        "&:after": {
          content: '""',
          display: "block",
          width: "80px",
          height: "5px",
          background: "linear-gradient(45deg, #4caf50, #2e7d32)",
          margin: "15px auto 0",
          borderRadius: "3px"
        }
      }}
    >
      تسجيل حضور الطالب
    </DialogTitle>
    <Typography variant="body1" sx={{ mt: 2, color: "#555" }}>
      يرجى تعبئة البيانات التالية لتسجيل حضور الطالب
    </Typography>
  </Box>

 <DialogContent sx={{ padding: { xs: "10px 0", md: "20px 0" } }}>
  <Grid container spacing={3}>
    {/* Student Info Section */}
    <Grid item xs={12}>
      <Paper sx={{
        padding: "16px",
        borderRadius: "10px",
        backgroundColor: "#f5f7fa",
        border: "1px solid #e0e3e7",
        marginBottom: "16px"
      }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 600,
              color: "#1976d2",
              mb: 1,
              display: 'flex',
              alignItems: 'center'
            }}>
              <Person sx={{ marginLeft: 1, fontSize: '1.2rem' }} />
              الطالب: {studentData?.studentName}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 600,
              color: "#1976d2",
              mb: 1,
              display: 'flex',
              alignItems: 'center'
            }}>
              <Badge sx={{ marginLeft: 1, fontSize: '1.2rem' }} />
              رقم الهوية: {studentData?.nationalId}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Grid>

    {/* Attendance Details Section */}
    <Grid item xs={12} md={6}>
      <FormControl style={{minWidth:"200px"}} fullWidth>
        <InputLabel sx={{ 
          fontFamily: '"Cairo", sans-serif',
          fontSize: "1rem",
          color: "#555"
        }}>
          المستوى
        </InputLabel>
        <Select
          name="level"
          value={attendanceData.level}
          onChange={handleAttendanceChange}
          label="المستوى"
          required
          sx={{
            fontFamily: '"Cairo", sans-serif',
            borderRadius: "10px",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ddd"
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#1976d2"
            }
          }}
        >
          {levels.map((level) => (
            <MenuItem 
              key={level} 
              value={level}
              sx={{ fontFamily: '"Cairo", sans-serif' }}
            >
              {level}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
    
    <Grid item xs={12} md={6}>
      <FormControl style={{minWidth:"200px"}} fullWidth>
        <InputLabel sx={{ 
          fontFamily: '"Cairo", sans-serif',
          fontSize: "1rem",
          color: "#555"
        }}>
          الدبلوم
        </InputLabel>
        <Select
          name="diploma"
          value={attendanceData.diploma}
          onChange={handleAttendanceChange}
          label="الدبلوم"
          required
          sx={{
            fontFamily: '"Cairo", sans-serif',
            borderRadius: "10px",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ddd"
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#1976d2"
            }
          }}
        >
          {diplomas.map((diploma) => (
            <MenuItem 
              key={diploma} 
              value={diploma}
              sx={{ fontFamily: '"Cairo", sans-serif' }}
            >
              {diploma}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
    
    <Grid item xs={12}>
       <FormControl style={{ minWidth: "200px" }} fullWidth>
  
  <TextField
    name="course"
    value={attendanceData.course}
    onChange={handleAttendanceChange}
    label="المقرر"
    required
    sx={{
      fontFamily: '"Cairo", sans-serif',
      borderRadius: "10px",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#ddd"
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#1976d2"
      }
    }}
  />
</FormControl>

    </Grid>
    
    {/* Attendance Time Section */}
    <Grid item xs={12} md={6}>
      <TextField
      style={{minWidth:"200px"}}
        label="ساعة الحضور"
        type="time"
        fullWidth
        value={new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
        InputLabelProps={{
          shrink: true,
          style: { fontFamily: '"Cairo", sans-serif' }
        }}
        inputProps={{
          step: 300, // 5 min
          style: { fontFamily: '"Cairo", sans-serif' }
        }}
        sx={{
          fontFamily: '"Cairo", sans-serif',
          borderRadius: "10px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ddd"
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1976d2"
          }
        }}
      />
    </Grid>
    
    <Grid item xs={12} md={6}>
      <TextField
      style={{minWidth:"200px"}}
        label="تاريخ الحضور"
        type="date"
        fullWidth
        value={new Date().toISOString().substr(0, 10)}
        InputLabelProps={{
          shrink: true,
          style: { fontFamily: '"Cairo", sans-serif' }
        }}
        sx={{
          fontFamily: '"Cairo", sans-serif',
          borderRadius: "10px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ddd"
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1976d2"
          }
        }}
      />
    </Grid>
    
    {/* Confirmation Section */}
    <Grid item xs={12}>
      <Paper
        elevation={0}
        sx={{
          padding: "16px",
          borderRadius: "10px",
          backgroundColor: "#f8f9fa",
          border: "1px solid #eee"
        }}
      >
        <Grid container alignItems="center">
          <Grid style={{minWidth:"400px"}} item xs={12} md={8}>
            <FormControlLabel
              control={
                <Checkbox
                  name="confirmed"
                  checked={attendanceData.confirmed}
                  onChange={handleAttendanceChange}
                  color="primary"
                  sx={{
                    color: "#4caf50",
                    "&.Mui-checked": {
                      color: "#4caf50"
                    }
                  }}
                />
              }
              label={
                <Typography 
                  sx={{ 
                    fontFamily: '"Cairo", sans-serif',
                    fontWeight: 600,
                    color: "#555"
                  }}
                >
                  أؤكد أن الطالب حضر المحاضرة اليوم
                </Typography>
              }
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'left' }}>
            <Typography variant="body2" sx={{ 
              fontFamily: '"Cairo", sans-serif',
              color: "#555",
              fontStyle: 'italic'
            }}>
              {new Date().toLocaleString('ar-EG', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  </Grid>
</DialogContent>

  <DialogActions sx={{ 
  padding: "20px", 
  justifyContent: "center",
  gap: 2
}}>
  <Button
    onClick={handleCloseAttendanceDialog}
    variant="outlined"
    color="error"
    startIcon={<Close />}
    sx={{
      borderRadius: "10px",
      padding: "12px 24px",
      fontWeight: 600,
      fontFamily: '"Cairo", sans-serif',
      fontSize: "1rem",
      border: "2px solid #f44336",
      color: "#f44336",
      "& .MuiButton-startIcon": {
        marginRight: "8px", // Added right margin for RTL
        marginLeft: "0px"  // Reset left margin
      },
      "&:hover": {
        border: "2px solid #d32f2f",
        backgroundColor: "rgba(244, 67, 54, 0.04)"
      }
    }}
  >
    إلغاء
  </Button>
  <Button
    onClick={handleAttendanceSubmit}
    variant="contained"
    color="primary"
    startIcon={<Check />}
    disabled={!attendanceData.confirmed}
    sx={{
      borderRadius: "10px",
      padding: "12px 24px",
      fontWeight: 600,
      fontFamily: '"Cairo", sans-serif',
      fontSize: "1rem",
      background: "linear-gradient(45deg, #4caf50, #2e7d32)",
      boxShadow: "0 4px 8px rgba(76, 175, 80, 0.2)",
      "& .MuiButton-startIcon": {
        marginRight: "8px", // Added right margin for RTL
        marginLeft: "0px"   // Reset left margin
      },
      "&:hover": {
        background: "linear-gradient(45deg, #388e3c, #1b5e20)",
        boxShadow: "0 6px 12px rgba(76, 175, 80, 0.3)"
      },
      "&.Mui-disabled": {
        background: "#e0e0e0",
        color: "#9e9e9e"
      }
    }}
  >
    تأكيد الحضور
  </Button>
</DialogActions>
</Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={error ? "error" : "success"}
            icon={error ? <Error /> : <CheckCircle />}
            sx={{
              width: "100%",
              fontFamily: '"Cairo", sans-serif',
              fontSize: "1rem",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)"
            }}
          >
            {error || "تم تسجيل حضور الطالب بنجاح"}
          </Alert>
        </Snackbar>
      </Box>
<Box sx={{ 
  position: 'absolute',
  top: 20,
  left: 20,
  display: 'flex',
  alignItems: 'center'
}}>
  <Button
    variant="outlined"
    color="error"
    onClick={handleLogout}
    startIcon={<Close />}
    sx={{
      borderRadius: "8px",
      padding: "8px 16px",
      fontWeight: 600,
      fontFamily: '"Cairo", sans-serif',
      "& .MuiButton-startIcon": {
        marginRight: "8px",
        marginLeft: "0px"
      }
    }}
  >
    تسجيل الخروج
  </Button>
</Box>
    </ThemeProvider>
  );
};

export default AttendancePage;