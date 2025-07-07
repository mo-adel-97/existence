// src/pages/LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  CircularProgress,
  Paper,
  Alert,
  CssBaseline,
  ThemeProvider,
  createTheme
} from "@mui/material";
import { Lock, Person } from "@mui/icons-material";

// Create theme with Cairo font
const theme = createTheme({
  typography: {
    fontFamily: '"Cairo", sans-serif',
    h4: {
      fontWeight: 700,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Cairo", sans-serif',
          fontWeight: 600,
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
  },
});

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    // Skip ngrok warning by adding headers
    const response = await fetch("https://012d-130-164-183-113.ngrok-free.app/api/userinfo", {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
    if (!response.ok) {
      throw new Error("فشل في جلب بيانات المستخدمين");
    }
    const users = await response.json();

    const authenticatedUser = users.find(
      user => user.userName === username && user.password === password
    );

    if (authenticatedUser) {
      // Save ALL user data to localStorage
      localStorage.setItem("user", JSON.stringify({
        id: authenticatedUser.id,
        code: authenticatedUser.code,
        guid: authenticatedUser.guid,
        userName: authenticatedUser.userName,
        password: authenticatedUser.password,
        fullName: authenticatedUser.fullName,
        staut_: authenticatedUser.staut_,
        chkBranch: authenticatedUser.chkBranch,
        branchGuid: authenticatedUser.branchGuid,
        chkAmount: authenticatedUser.chkAmount,
        chkOtherFess: authenticatedUser.chkOtherFess,
        sellerGuid: authenticatedUser.sellerGuid,
        chkTrainer: authenticatedUser.chkTrainer,
        trainerGuid: authenticatedUser.trainerGuid,
        branchForWork: authenticatedUser.branchForWork,
        departGuid: authenticatedUser.departGuid,
        userDepart: authenticatedUser.userDepart,
        userJop: authenticatedUser.userJop
      }));

      navigate("/attendance");
    } else {
      setError("اسم المستخدم أو كلمة المرور غير صحيحة");
    }
  } catch (err) {
    setError(err.message || "حدث خطأ أثناء محاولة تسجيل الدخول");
  } finally {
    setLoading(false);
  }
};

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)",
          fontFamily: '"Cairo", sans-serif',
          textAlign: "right",
          padding: "20px"
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: { xs: "25px", md: "40px" },
            borderRadius: "16px",
            width: "100%",
            maxWidth: "500px",
            background: "#ffffff"
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Lock 
              color="primary" 
              sx={{ 
                fontSize: 50,
                bgcolor: "#1976d210",
                p: 2,
                borderRadius: "50%"
              }} 
            />
            <Typography 
              variant="h4" 
              sx={{ 
                mt: 2,
                fontWeight: 700,
                color: "#2c3e50"
              }}
            >
              تسجيل الدخول
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, color: "#555" }}>
              يرجى إدخال بيانات الدخول الخاصة بك
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, fontFamily: '"Cairo", sans-serif' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="اسم المستخدم"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
              InputProps={{
                startAdornment: <Person sx={{ mr: 1, color: "#1976d2" }} />,
                style: { fontFamily: '"Cairo", sans-serif' }
              }}
              InputLabelProps={{
                style: { fontFamily: '"Cairo", sans-serif' }
              }}
              sx={{
                mb: 3,
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
            />

            <TextField
              fullWidth
              label="كلمة المرور"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              InputProps={{
                startAdornment: <Lock sx={{ mr: 1, color: "#1976d2" }} />,
                style: { fontFamily: '"Cairo", sans-serif' }
              }}
              InputLabelProps={{
                style: { fontFamily: '"Cairo", sans-serif' }
              }}
              sx={{
                mb: 3,
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
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{
                mt: 2,
                py: 2,
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: "10px",
                background: "linear-gradient(45deg, #1976d2, #2196f3)",
                "&:hover": {
                  background: "linear-gradient(45deg, #1565c0, #1e88e5)"
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "تسجيل الدخول"
              )}
            </Button>
          </form>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default LoginPage;