import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Snackbar,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Alert,  // Added Alert import
  Button  // Added Button import
} from "@mui/material";
import { 
  Error, 
  CheckCircle,
  Close  // Added Close icon import
} from "@mui/icons-material";
// Rest of your code remains the same...
import ProfessionalCard from "../Components/common/ProfessionalCard";
import StudentSearchForm from "../Components/attendance/StudentSearchForm";
import StudentInfoCard from "../Components/attendance/StudentInfoCard";
import AttendanceDialog from "../Components/attendance/AttendanceDialog";

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

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
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

  // const handleAttendanceSubmit = () => {
  //   // Submit attendance data to API
  //   console.log("Attendance submitted:", attendanceData);
  //   setAttendanceDialogOpen(false);
  //   setSnackbarOpen(true);
  //   setError(null);
  // };
const handleAttendanceSubmit = async () => {
  // Ensure all required fields are filled
  if (!studentData || !studentData.studentName || !studentData.nationalId || !attendanceData.level || !attendanceData.diploma) {
    setError("يرجى ملء جميع الحقول المطلوبة");
    setSnackbarOpen(true);
    return;
  }

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const payload = {
    name: studentData.studentName,
    national_id: studentData.nationalId,
    level_id: attendanceData.level,
    diploma_id: attendanceData.diploma,
    course: attendanceData.course,
    attendance_date: new Date().toISOString().split("T")[0], // Format the date correctly
    attendance_time: new Date().toTimeString().split(" ")[0], // Time format: HH:MM:SS
    created_by: currentUser.guid,
  };

  console.log("Payload being sent:", payload); // Debugging the payload

  try {
    const response = await fetch("https://filesregsiteration.sstli.com/PostAttendent.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.success) {
      setError(null);
      setSnackbarOpen(true);
    } else {
      throw new Error(data.message);
    }
  } catch (err) {
    setError("فشل في تسجيل الحضور: " + err.message);
    setSnackbarOpen(true);
  } finally {
    setAttendanceDialogOpen(false);
  }
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
            <StudentSearchForm
              studentId={studentId}
              setStudentId={setStudentId}
              loading={loading}
              handleAttendance={handleAttendance}
            />
          ) : (
            <StudentInfoCard
              studentData={studentData}
              handleOpenAttendanceDialog={handleOpenAttendanceDialog}
              handleReset={handleReset}
            />
          )}
        </ProfessionalCard>

        <AttendanceDialog
          open={attendanceDialogOpen}
          onClose={handleCloseAttendanceDialog}
          studentData={studentData}
          attendanceData={attendanceData}
          handleAttendanceChange={handleAttendanceChange}
          handleAttendanceSubmit={handleAttendanceSubmit}
          levels={levels}
          diplomas={diplomas}
          courses={courses}
        />

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
      </Box>
    </ThemeProvider>
  );
};

export default AttendancePage;