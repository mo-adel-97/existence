import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import {
  Box, TextField, Button, Grid, Snackbar, Alert, Typography,
  Paper, Container, Divider, CircularProgress, useTheme,
  Autocomplete
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import SaveIcon from '@mui/icons-material/Save';
import AttendanceSidebar from '../Components/Sidebar/Sidebar';

const TeachingForm = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    trainer_name: '',
    trainer_guid: '',
    study_level: '',
    diploma_name: '',
    subject_name: '',
  });

  const [trainers, setTrainers] = useState([]);
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingTrainers, setFetchingTrainers] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const drawerWidth = 280;

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setFetchingTrainers(true);
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.branchForWork) {
          throw new Error('User branch information not found');
        }

        const response = await axios.get('http://192.168.50.170:5275/api/userinfo');
        const branchTrainers = response.data.filter(user => 
          user.chkTrainer && user.branchForWork === user.branchForWork
        );

        const trainersList = branchTrainers.map(trainer => ({
          label: trainer.fullName,
          guid: trainer.guid
        }));

        setTrainers(trainersList);
        setFilteredTrainers(trainersList);

        // Set current user if they are a trainer
        if (user.chkTrainer) {
          const currentTrainer = trainersList.find(t => t.guid === user.guid);
          if (currentTrainer) {
            setFormData(prev => ({
              ...prev,
              trainer_name: currentTrainer.label,
              trainer_guid: currentTrainer.guid
            }));
          }
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'فشل في تحميل بيانات المدربين',
          severity: 'error'
        });
      } finally {
        setFetchingTrainers(false);
      }
    };

    fetchTrainers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = trainers.filter(trainer => 
        trainer.label.includes(searchTerm)
      );
      setFilteredTrainers(filtered);
    } else {
      setFilteredTrainers(trainers);
    }
  }, [searchTerm, trainers]);

  const handleTrainerChange = (event, value) => {
    setFormData(prev => ({
      ...prev,
      trainer_name: value?.label || '',
      trainer_guid: value?.guid || ''
    }));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const requiredFields = ['trainer_name', 'study_level', 'diploma_name', 'subject_name'];
  const emptyField = requiredFields.find(field => !formData[field]);
  
  if (emptyField) {
    const fieldNames = {
      trainer_name: 'اسم المدرب',
      study_level: 'المستوى الدراسي',
      diploma_name: 'اسم الدبلوم',
      subject_name: 'اسم المقرر'
    };
    setSnackbar({ open: true, message: `حقل مطلوب: ${fieldNames[emptyField]}`, severity: 'error' });
    setLoading(false);
    return;
  }

  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.guid) {
      throw new Error('لم يتم العثور على بيانات المستخدم');
    }

    const postData = {
      trainer_geo_id: user.guid, // From localStorage user guid
      trainer_name: formData.trainer_name,
      trainer_guid: formData.trainer_guid,
      study_level: formData.study_level,
      diploma_id: uuidv4(),
      diploma_name: formData.diploma_name,
      subject_id: uuidv4(),
      subject_name: formData.subject_name
    };

    const res = await axios.post('https://filesregsiteration.sstli.com/add_teaching_data.php', postData);
    
    if (res.data.success) {
      setSnackbar({ open: true, message: 'تم حفظ البيانات بنجاح', severity: 'success' });
      setFormData({
        trainer_name: '',
        trainer_guid: '',
        study_level: '',
        diploma_name: '',
        subject_name: '',
      });
    } else {
      throw new Error(res.data.message || 'حدث خطأ أثناء حفظ البيانات');
    }
  } catch (err) {
    setSnackbar({ 
      open: true, 
      message: err.response?.data?.message || err.message || 'حدث خطأ غير متوقع',
      severity: 'error' 
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <Box sx={{ 
      display: 'flex', 
      direction: 'rtl', 
      minHeight: '100vh',
      backgroundColor: theme.palette.grey[100]
    }}>
      <AttendanceSidebar />
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          ml: `${drawerWidth}px`,
          fontFamily: '"Cairo", sans-serif',
          direction: 'rtl',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          width: `calc(100% - ${drawerWidth}px)`,
          p: 3
        }}
      >
        <Container 
          maxWidth="md" 
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            py: 4
          }}
        >
          <Paper 
            elevation={4} 
            sx={{ 
              p: 6, 
              borderRadius: 4,
              boxShadow: theme.shadows[5],
              backgroundColor: theme.palette.background.paper,
              width: '100%',
              maxWidth: '800px',
              marginRight:"250px"
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <SchoolIcon sx={{ 
                fontSize: 48, 
                color: theme.palette.primary.main,
                mb: 2
              }} />
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  fontWeight: 700,
                  fontFamily: '"Cairo", sans-serif',
                  color: theme.palette.primary.dark,
                  mb: 1
                }}
              >
                نظام تسجيل المقررات الدراسية
              </Typography>
              <Divider sx={{ 
                my: 3,
                '&:before, &:after': {
                  borderColor: theme.palette.primary.light,
                }
              }} />
              <Typography 
                variant="subtitle1" 
                color="text.secondary"
                sx={{ fontFamily: '"Cairo", sans-serif' }}
              >
                الرجاء إدخال بيانات المقرر الدراسي بشكل كامل
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Autocomplete
                    options={filteredTrainers}
                    getOptionLabel={(option) => option.label}
                    onChange={handleTrainerChange}
                    value={trainers.find(t => t.guid === formData.trainer_guid) || null}
                    loading={fetchingTrainers}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="اسم المدرب"
                        variant="outlined"
                        onChange={handleSearchChange}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {fetchingTrainers ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                          sx: {
                            fontFamily: '"Cairo", sans-serif',
                            minWidth: '250px'
                          }
                        }}
                        sx={{ 
                          fontFamily: '"Cairo", sans-serif',
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            minWidth: '250px'
                          }
                        }}
                        InputLabelProps={{
                          sx: { 
                            fontFamily: '"Cairo", sans-serif',
                            fontSize: '1rem'
                          }
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box 
                        component="li" 
                        {...props} 
                        sx={{ fontFamily: '"Cairo", sans-serif !important' }}
                      >
                        {option.label}
                      </Box>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="المستوى الدراسي"
                    name="study_level"
                    fullWidth
                    value={formData.study_level}
                    onChange={handleChange}
                    variant="outlined"
                    size="medium"
                    sx={{ 
                      fontFamily: '"Cairo", sans-serif',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                    InputProps={{
                      sx: { 
                        fontFamily: '"Cairo", sans-serif',
                        fontSize: '1rem'
                      }
                    }}
                    InputLabelProps={{
                      sx: { 
                        fontFamily: '"Cairo", sans-serif',
                        fontSize: '1rem'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="اسم الدبلوم"
                    name="diploma_name"
                    fullWidth
                    value={formData.diploma_name}
                    onChange={handleChange}
                    variant="outlined"
                    size="medium"
                    sx={{ 
                      fontFamily: '"Cairo", sans-serif',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                    InputProps={{
                      sx: { 
                        fontFamily: '"Cairo", sans-serif',
                        fontSize: '1rem'
                      }
                    }}
                    InputLabelProps={{
                      sx: { 
                        fontFamily: '"Cairo", sans-serif',
                        fontSize: '1rem'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="اسم المقرر"
                    name="subject_name"
                    fullWidth
                    value={formData.subject_name}
                    onChange={handleChange}
                    variant="outlined"
                    size="medium"
                    sx={{ 
                      fontFamily: '"Cairo", sans-serif',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                    InputProps={{
                      sx: { 
                        fontFamily: '"Cairo", sans-serif',
                        fontSize: '1rem'
                      }
                    }}
                    InputLabelProps={{
                      sx: { 
                        fontFamily: '"Cairo", sans-serif',
                        fontSize: '1rem'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'center', mt: 4 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={!loading && <SaveIcon />}
                    color="primary"
                    size="large"
                    disabled={loading}
                    sx={{
                      px: 8,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontFamily: '"Cairo", sans-serif',
                      fontWeight: 700,
                      borderRadius: 2,
                      boxShadow: theme.shadows[3],
                      '&:hover': {
                        boxShadow: theme.shadows[5],
                        backgroundColor: theme.palette.primary.dark
                      }
                    }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                        جاري الحفظ...
                      </>
                    ) : 'حفظ البيانات'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity} 
            sx={{ 
              width: '100%',
              fontFamily: '"Cairo", sans-serif',
              fontSize: '1rem',
              borderRadius: 2,
              boxShadow: theme.shadows[3]
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default TeachingForm;