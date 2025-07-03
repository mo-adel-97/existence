import React from 'react';
import { 
  TextField, 
  Box, 
  CircularProgress, 
  Typography, 
  Avatar 
} from '@mui/material';
import { Assignment } from '@mui/icons-material';
import GradientButton from '../common/GradientButton';

const StudentSearchForm = ({ 
  studentId, 
  setStudentId, 
  loading, 
  handleAttendance 
}) => {
  return (
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
          const isValid = /^[1-9][0-9]{0,9}$/.test(value) && value.length <= 10;
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
  );
};

export default StudentSearchForm;