import React from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  Paper, 
  Grid 
} from '@mui/material';
import { 
  Person, 
  School, 
  Badge, 
  Phone, 
  Flag, 
  Assignment,
  CheckCircle 
} from '@mui/icons-material';
// Update these imports:
import SuccessButton from '../common/SuccessButton';
import ErrorButton from '../common/ErrorButton';

const StudentInfoCard = ({ 
  studentData, 
  handleOpenAttendanceDialog, 
  handleReset 
}) => {
  return (
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

            {/* Additional Info */}
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
  );
};

export default StudentInfoCard;