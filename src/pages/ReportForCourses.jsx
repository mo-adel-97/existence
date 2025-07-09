import React, { useState, useEffect } from 'react';
import AttendanceSidebar from '../Components/Sidebar/Sidebar';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CssBaseline,
  Drawer,
  useTheme
} from '@mui/material';
import {
  Person,
  School,
  MenuBook,
  Download,
  Assessment,
  ExpandMore,
  ArticleOutlined
} from '@mui/icons-material';

const TeachingDataReport = () => {
  const theme = useTheme();
  const [teachingData, setTeachingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [statistics, setStatistics] = useState({
    totalTrainers: 0,
    totalDiplomas: 0,
    totalSubjects: 0,
    uniqueDiplomas: []
  });

  useEffect(() => {
    fetchTeachingData();
  }, []);

  const fetchTeachingData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://filesregsiteration.sstli.com/get_teaching_data.php');
      
      if (!response.ok) {
        throw new Error('فشل في جلب بيانات التدريب');
      }
      
      const data = await response.json();
      setTeachingData(data);
      calculateStatistics(data);
      
    } catch (err) {
      setError(err.message);
      console.error('Error fetching teaching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (data) => {
    const totalTrainers = data.length;
    let totalDiplomas = 0;
    let totalSubjects = 0;
    const uniqueDiplomasSet = new Set();

    data.forEach(trainer => {
      totalDiplomas += trainer.diplomas.length;
      trainer.diplomas.forEach(diploma => {
        uniqueDiplomasSet.add(diploma.diploma_name);
        totalSubjects += diploma.subjects.length;
      });
    });

    setStatistics({
      totalTrainers,
      totalDiplomas,
      totalSubjects,
      uniqueDiplomas: Array.from(uniqueDiplomasSet)
    });
  };

  const exportToWord = () => {
    // ... (keep your existing exportToWord function)
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} sx={{ color: '#4caf50' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ fontFamily: '"Cairo", sans-serif' }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f7fa' }}>
      <CssBaseline />
      
      {/* Sidebar */}
      <AttendanceSidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          p: 3,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginRight: 0,
          minHeight: '100vh'
        }}
      >
        {/* Header */}
        <Paper sx={{
          p: 4,
          mb: 3,
          textAlign: 'center',
          borderRadius: '12px',
          background:'linear-gradient(45deg, #1976d2, #1565c0)',
          color: 'white',
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
          border: 'none'
        }}>
          <Avatar sx={{
            width: 80,
            height: 80,
            margin: '0 auto 20px',
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <Assessment sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h4" sx={{ 
            fontFamily: '"Cairo", sans-serif',
            fontWeight: 700,
            mb: 1
          }}>
            تقرير بيانات التدريب
          </Typography>
          <Typography variant="subtitle1" sx={{ 
            fontFamily: '"Cairo", sans-serif',
            opacity: 0.9
          }}>
            تاريخ التقرير: {new Date().toLocaleDateString('ar-EG')}
          </Typography>
        </Paper>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {[
            { 
              value: statistics.totalTrainers, 
              label: 'المدربين', 
              icon: <Person sx={{ fontSize: 40 }} />,
              color: 'linear-gradient(45deg, #1976d2, #1565c0)'
            },
            { 
              value: statistics.totalDiplomas, 
              label: 'إجمالي الدبلومات', 
              icon: <School sx={{ fontSize: 40 }} />,
              color: 'linear-gradient(45deg, #ff9800, #f57c00)'
            },
            { 
              value: statistics.totalSubjects, 
              label: 'إجمالي المواد', 
              icon: <MenuBook sx={{ fontSize: 40 }} />,
              color: 'linear-gradient(45deg, #9c27b0, #7b1fa2)'
            },
            { 
              value: statistics.uniqueDiplomas.length, 
              label: 'الدبلومات المتاحة', 
              icon: <ArticleOutlined sx={{ fontSize: 40 }} />,
              color: 'linear-gradient(45deg, #f44336, #d32f2f)'
            }
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ 
                borderRadius: '12px',
                background: stat.color,
                color: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 700, 
                    mb: 1,
                    fontSize: '2rem'
                  }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    fontSize: '1rem',
                    fontFamily: '"Cairo", sans-serif'
                  }}>
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Export Button */}
        <Box sx={{ 
          textAlign: 'center', 
          mb: 4,
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={exportToWord}
            sx={{
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: 600,
              fontFamily: '"Cairo", sans-serif',
              background: 'linear-gradient(45deg, #4caf50, #2e7d32)',
              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #388e3c, #1b5e20)',
                boxShadow: '0 6px 16px rgba(76, 175, 80, 0.4)'
              }
            }}
          >
            تصدير التقرير كملف Word
          </Button>
        </Box>

        {/* Trainers Data */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {teachingData.map((trainer, index) => (
            <Grid item xs={12} key={index}>
              <Paper sx={{
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                border: 'none'
              }}>
                {/* Trainer Header */}
                <Box sx={{
                  background:  'linear-gradient(45deg, #4caf50, #2e7d32)',
                  color: 'white',
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <Avatar sx={{
                    width: 56,
                    height: 56,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <Person sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ 
                      fontFamily: '"Cairo", sans-serif',
                      fontWeight: 700,
                      mb: 0.5
                    }}>
                      {trainer.trainer_name}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      opacity: 0.9,
                      fontFamily: '"Cairo", sans-serif',
                      fontSize: '0.8rem'
                    }}>                 
                    </Typography>
                  </Box>
                </Box>

                {/* Diplomas */}
                <Box sx={{ p: 2 }}>
                  {trainer.diplomas.map((diploma, diplomaIndex) => (
                    <Accordion 
                      key={diplomaIndex} 
                      sx={{ 
                        mb: 2,
                        borderRadius: '8px',
                        '&:before': { display: 'none' },
                        boxShadow: 'none',
                        border: '1px solid rgba(0, 0, 0, 0.05)'
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMore sx={{ color: 'white' }} />}
                        sx={{
                          background: 'linear-gradient(45deg, #ff9800, #f57c00)',
                          color: 'white',
                          borderRadius: '8px',
                          '&.Mui-expanded': {
                            borderRadius: '8px 8px 0 0'
                          },
                          minHeight: '56px'
                        }}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 2,
                          flexGrow: 1
                        }}>
                          <School />
                          <Typography sx={{ 
                            fontFamily: '"Cairo", sans-serif',
                            fontWeight: 600,
                            fontSize: '1rem'
                          }}>
                            {diploma.diploma_name}
                          </Typography>
                          <Chip 
                            label={`${diploma.subjects.length} مادة`}
                            size="small"
                            sx={{ 
                              bgcolor: 'rgba(255, 255, 255, 0.2)',
                              color: 'white',
                              fontFamily: '"Cairo", sans-serif',
                              ml: 'auto'
                            }}
                          />
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ 
                        backgroundColor: '#f8f9fa',
                        borderRadius: '0 0 8px 8px',
                        p: 2
                      }}>
                        <Typography variant="subtitle1" sx={{ 
                          fontFamily: '"Cairo", sans-serif',
                          fontWeight: 600,
                          mb: 1.5,
                          color: '#2c3e50',
                          fontSize: '0.9rem'
                        }}>
                          المواد الدراسية:
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: 1,
                          '& > *': {
                            m: 0.5
                          }
                        }}>
                          {diploma.subjects.map((subject, subjectIndex) => (
                            <Chip
                              key={subjectIndex}
                              label={subject.subject_name}
                              icon={<MenuBook sx={{ fontSize: '16px' }} />}
                              variant="outlined"
                              sx={{
                                borderColor: '#4caf50',
                                color: '#2e7d32',
                                fontFamily: '"Cairo", sans-serif',
                                fontWeight: 500,
                                fontSize: '0.8rem',
                                '&:hover': {
                                  backgroundColor: '#e8f5e9',
                                  borderColor: '#2e7d32'
                                }
                              }}
                            />
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Summary Table */}
        <Paper sx={{ 
          borderRadius: '12px', 
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          mb: 4
        }}>
          <Box sx={{
            background: 'linear-gradient(45deg, #2c3e50, #34495e)',
            color: 'white',
            p: 2,
            textAlign: 'center'
          }}>
            <Typography variant="h6" sx={{ 
              fontFamily: '"Cairo", sans-serif',
              fontWeight: 700
            }}>
              جدول ملخص البيانات
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ 
                  backgroundColor: '#4caf50',
                  '& th': {
                    fontFamily: '"Cairo", sans-serif',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: 'white',
                    py: 1.5
                  }
                }}>
                  <TableCell>المدرب</TableCell>
                  <TableCell>الدبلوم</TableCell>
                  <TableCell align="center">عدد المواد</TableCell>
                  <TableCell>المواد</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teachingData.map((trainer, trainerIndex) =>
                  trainer.diplomas.map((diploma, diplomaIndex) => (
                    <TableRow 
                      key={`${trainerIndex}-${diplomaIndex}`}
                      sx={{ 
                        '&:nth-of-type(odd)': { backgroundColor: '#f8f9fa' },
                        '&:hover': { backgroundColor: '#e3f2fd' },
                        '& td': {
                          py: 1.5,
                          fontFamily: '"Cairo", sans-serif',
                          fontSize: '0.9rem'
                        }
                      }}
                    >
                      <TableCell>{trainer.trainer_name}</TableCell>
                      <TableCell>{diploma.diploma_name}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={diploma.subjects.length}
                          size="small"
                          sx={{ 
                            bgcolor: '#e3f2fd',
                            color: '#1976d2',
                            fontWeight: 600,
                            fontSize: '0.8rem'
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.85rem' }}>
                        {diploma.subjects.map((subject, index) => (
                          <React.Fragment key={index}>
                            {subject.subject_name}
                            {index < diploma.subjects.length - 1 ? '، ' : ''}
                          </React.Fragment>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default TeachingDataReport;