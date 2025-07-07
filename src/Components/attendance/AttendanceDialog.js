import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Avatar,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  CircularProgress
} from '@mui/material';
import { Assignment, Person, Badge, Close, Check, Warning } from '@mui/icons-material';

const AttendanceDialog = ({
  open,
  onClose,
  studentData,
  attendanceData,
  handleAttendanceChange,
  handleAttendanceSubmit,
  levels,
  diplomas,
  submitting,
  courses
}) => {
  const [studyInfo, setStudyInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noBranchData, setNoBranchData] = useState(false);

  useEffect(() => {
    if (open && studentData?.accountGuid) {
      fetchStudentStudyInfo();
    } else {
      // Reset states when dialog closes
      setStudyInfo([]);
      setNoBranchData(false);
      setError(null);
    }
  }, [open, studentData]);

  const fetchStudentStudyInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      setNoBranchData(false);
      
      // Get branch ID from local storage
      const user = JSON.parse(localStorage.getItem('user'));
      const branchId = user?.branchForWork;
      
      if (!branchId) {
        throw new Error('Branch ID not found in local storage');
      }
      
      const response = await fetch(
        `http://192.168.50.170:5275/api/StudentStudyInfo/${studentData.accountGuid}/${branchId}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch student study info');
      }
      
      const data = await response.json();
      
      if (data.length === 0) {
        setNoBranchData(true);
      } else {
        setStudyInfo(data);
        // Auto-fill the first study info if available
        handleAttendanceChange({
          target: {
            name: 'diploma',
            value: data[0].diplomName
          }
        });
        
        handleAttendanceChange({
          target: {
            name: 'level',
            value: data[0].levelName
          }
        });
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching study info:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
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
            bgcolor: noBranchData ? "#ff9800" : "#4caf50",
            boxShadow: noBranchData ? "0 4px 12px rgba(255, 152, 0, 0.3)" : "0 4px 12px rgba(76, 175, 80, 0.3)"
          }}
        >
          {noBranchData ? <Warning sx={{ fontSize: 32 }} /> : <Assignment sx={{ fontSize: 32 }} />}
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
              background: noBranchData ? "linear-gradient(45deg, #ff9800, #f57c00)" : "linear-gradient(45deg, #4caf50, #2e7d32)",
              margin: "15px auto 0",
              borderRadius: "3px"
            }
          }}
        >
          {noBranchData ? "تنبيه" : "تسجيل حضور الطالب"}
        </DialogTitle>
        <Typography variant="body1" sx={{ mt: 2, color: "#555" }}>
          {noBranchData ? "لا يمكن تسجيل حضور هذا الطالب" : "يرجى تعبئة البيانات التالية لتسجيل حضور الطالب"}
        </Typography>
      </Box>

      <DialogContent sx={{ padding: { xs: "10px 0", md: "20px 0" } }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ 
            backgroundColor: '#ffeeee',
            padding: '16px',
            borderRadius: '8px',
            textAlign: 'center',
            color: '#d32f2f',
            mb: 2
          }}>
            <Typography>{error}</Typography>
          </Box>
        ) : noBranchData ? (
          <Box sx={{
            textAlign: 'center',
            padding: '20px',
            backgroundColor: '#fff3e0',
            borderRadius: '10px',
            border: '1px solid #ffe0b2',
            marginBottom: '20px'
          }}>
            <Warning sx={{ 
              fontSize: 48, 
              color: '#ff9800',
              mb: 2
            }} />
            <Typography variant="h6" sx={{ 
              fontWeight: 600,
              color: '#e65100',
              mb: 1
            }}>
              هذا الطالب لا يوجد معك في نفس الفرع
            </Typography>
            <Typography variant="body1" sx={{ color: '#555' }}>
              لا يمكن تسجيل حضور طالب غير مسجل في فرعك
            </Typography>
          </Box>
        ) : (
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

            {/* Study Program Selection */}
            {studyInfo.length > 0 && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel sx={{ 
                    fontFamily: '"Cairo", sans-serif',
                    fontSize: "1rem",
                    color: "#555"
                  }}>
                    البرنامج الدراسي
                  </InputLabel>
                  <Select
                    name="studyProgram"
                    value={attendanceData.studyProgram || 0}
                    onChange={(e) => {
                      const selectedInfo = studyInfo[e.target.value];
                      handleAttendanceChange({
                        target: {
                          name: 'diploma',
                          value: selectedInfo.diplomName
                        }
                      });
                      handleAttendanceChange({
                        target: {
                          name: 'level',
                          value: selectedInfo.levelName
                        }
                      });
                    }}
                    label="البرنامج الدراسي"
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
                    {studyInfo.map((info, index) => (
                      <MenuItem 
                        key={index} 
                        value={index}
                        sx={{ fontFamily: '"Cairo", sans-serif' }}
                      >
                        {info.diplomName} - {info.levelName} - {info.batchName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

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
                  {studyInfo.length > 0 ? (
                    [...new Set(studyInfo.map(info => info.levelName))].map((level) => (
                      <MenuItem 
                        key={level} 
                        value={level}
                        sx={{ fontFamily: '"Cairo", sans-serif' }}
                      >
                        {level}
                      </MenuItem>
                    ))
                  ) : (
                    levels.map((level) => (
                      <MenuItem 
                        key={level} 
                        value={level}
                        sx={{ fontFamily: '"Cairo", sans-serif' }}
                      >
                        {level}
                      </MenuItem>
                    ))
                  )}
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
                  {studyInfo.length > 0 ? (
                    [...new Set(studyInfo.map(info => info.diplomName))].map((diploma) => (
                      <MenuItem 
                        key={diploma} 
                        value={diploma}
                        sx={{ fontFamily: '"Cairo", sans-serif' }}
                      >
                        {diploma}
                      </MenuItem>
                    ))
                  ) : (
                    diplomas.map((diploma) => (
                      <MenuItem 
                        key={diploma} 
                        value={diploma}
                        sx={{ fontFamily: '"Cairo", sans-serif' }}
                      >
                        {diploma}
                      </MenuItem>
                    ))
                  )}
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
                  step: 300,
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
        )}
      </DialogContent>

      <DialogActions sx={{ 
        padding: "20px", 
        justifyContent: "center",
        gap: 2
      }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color={noBranchData ? "primary" : "error"}
          startIcon={<Close />}
          sx={{
            borderRadius: "10px",
            padding: "12px 24px",
            fontWeight: 600,
            fontFamily: '"Cairo", sans-serif',
            fontSize: "1rem",
            border: noBranchData ? "2px solid #2196f3" : "2px solid #f44336",
            color: noBranchData ? "#2196f3" : "#f44336",
            "& .MuiButton-startIcon": {
              marginRight: "8px",
              marginLeft: "0px"
            },
            "&:hover": {
              border: noBranchData ? "2px solid #1976d2" : "2px solid #d32f2f",
              backgroundColor: noBranchData ? "rgba(33, 150, 243, 0.04)" : "rgba(244, 67, 54, 0.04)"
            }
          }}
        >
          {noBranchData ? "حسناً" : "إلغاء"}
        </Button>
        
        {!noBranchData && (
  submitting ? (
    <CircularProgress
      size={32}
      sx={{ color: "#4caf50" }}
    />
  ) : (
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
          marginRight: "8px",
          marginLeft: "0px"
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
  )
)}

      </DialogActions>
    </Dialog>
  );
};

export default AttendanceDialog;