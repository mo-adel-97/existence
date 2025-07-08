import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  useTheme,
  styled,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Today as TodayIcon,
  Person as PersonIcon,
  Badge as IdIcon,
  School as LevelIcon,
  MenuBook as DiplomaIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { Document, Paragraph, Packer, AlignmentType, HeadingLevel, Table as DocxTable, TableRow as DocxRow, TableCell as DocxCell, WidthType } from 'docx';
import AttendanceSidebar from '../Components/Sidebar/Sidebar';

// Styled components
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontFamily: '"Cairo", sans-serif',
  fontWeight: 500,
}));

const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  fontFamily: '"Cairo", sans-serif',
  direction: 'rtl',
  borderTop: `1px solid ${theme.palette.divider}`,
  '& .MuiTablePagination-selectLabel': {
    marginTop: '1.5px',
    marginBottom: 0,
    fontSize: '0.875rem'
  },
  '& .MuiTablePagination-displayedRows': {
    marginTop: '1.5px',
    marginBottom: 0,
    fontSize: '0.875rem'
  },
  '& .MuiTablePagination-actions': {
    marginLeft: '8px',
    '& button': {
      padding: '6px',
      margin: '0 4px',
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: '4px',
      '&:hover': {
        backgroundColor: theme.palette.action.hover
      }
    }
  },
  '& .MuiSelect-select': {
    padding: '6px 32px 6px 12px',
    borderRadius: '4px',
    border: `1px solid ${theme.palette.divider}`,
    fontSize: '0.875rem'
  }
}));

const DailyAttendanceReport = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [students, setStudents] = useState([]);
  const [branchName, setBranchName] = useState('جارٍ التحميل...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTab, setSelectedTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchBranchName = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!user || !user.guid) {
        throw new Error('User GUID not found');
      }
      
      const response = await fetch(`http://192.168.50.170:5122/api/Trainer/UserBranchForWork?userGuid=${user.guid}`);
      if (!response.ok) throw new Error('Failed to fetch branch name');
      
      const data = await response.json();
      setBranchName(data[0].brEName);
    } catch (err) {
      console.error('Error fetching branch name:', err);
      setBranchName('غير محدد');
    }
  };

  const fetchStudents = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.branchForWork) {
        throw new Error('Branch information not found');
      }
      
      const response = await fetch(`http://192.168.50.170:5275/api/StudentStudyInfo/by-branch/${user.branchForWork}`);
      if (!response.ok) throw new Error('Failed to fetch students');
      
      const data = await response.json();
      setStudents(data);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      await fetchBranchName();
      const [studentsData] = await Promise.all([
        fetchStudents()
      ]);
      
      const response = await fetch('https://filesregsiteration.sstli.com/get_attendance.php');
      const result = await response.json();

      if (result.success && studentsData.length > 0) {
        const branchStudentIds = studentsData.map(student => student.nationalId);
        
        const todayData = result.data.filter(item => 
          item.attendance_date === dateFilter && 
          branchStudentIds.includes(item.national_id)
        );
        
        setData(todayData);
      } else {
        setData([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateFilter]);

  const handleRefresh = () => {
    fetchData();
    setPage(0);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStudent(null);
  };

  const handleExportWord = () => {
    const doc = new Document({
      description: "تقرير الحضور اليومي",
      styles: {
        paragraphStyles: [{
          id: "arabicStyle",
          name: "Arabic Style",
          run: {
            font: "Arial",
            size: 24,
            bold: true,
            color: "000000",
            rightToLeft: true
          },
          paragraph: {
            alignment: AlignmentType.RIGHT,
            spacing: { line: 400 }
          }
        }]
      },
      sections: [{
        properties: {
          direction: "rtl"
        },
        children: [
          new Paragraph({
            text: "تقرير الحضور اليومي",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            bold: true,
            size: 28
          }),
          new Paragraph({
            text: `تاريخ التقرير: ${format(new Date(dateFilter), 'EEEE, d MMMM yyyy', { locale: arSA })}`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            size: 22
          }),
          new Paragraph({
            text: `الفرع: ${branchName}`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 800 },
            size: 20
          }),

          new DocxTable({
            width: { size: 100, type: WidthType.PERCENTAGE },
            margins: {
              top: 400,
              bottom: 400,
              left: 400,
              right: 400,
            },
            columnWidths: [
              3000,
              ...Object.keys(groupedDataArray[0]?.courses || {}).map(() => 2000),
              2500,
              2000,
              2000,
              2000
            ],
            rows: [
              new DocxRow({
                children: [
                  ...Object.keys(groupedDataArray[0]?.courses || {}).map(course => 
                    new DocxCell({
                      children: [new Paragraph({
                        text: course,
                        bold: true,
                        size: 20
                      })],
                      shading: {
                        fill: "4472C4",
                      },
                      margins: {
                        top: 200,
                        bottom: 200,
                        left: 200,
                        right: 200,
                      }
                    })
                  ).reverse(),
                  
                  new DocxCell({
                    children: [new Paragraph({
                      text: "الدبلوم",
                      bold: true,
                      size: 20
                    })],
                    shading: {
                      fill: "4472C4",
                    }
                  }),
                  new DocxCell({
                    children: [new Paragraph({
                      text: "المستوى", 
                      bold: true,
                      size: 20
                    })],
                    shading: {
                      fill: "4472C4",
                    }
                  }),
                  new DocxCell({
                    children: [new Paragraph({
                      text: "رقم الهوية",
                      bold: true,
                      size: 20
                    })],
                    shading: {
                      fill: "4472C4",
                    }
                  }),
                  new DocxCell({
                    children: [new Paragraph({
                      text: "الاسم",
                      bold: true, 
                      size: 20
                    })],
                    shading: {
                      fill: "4472C4",
                    }
                  })
                ]
              }),
              
              ...groupedDataArray.map(({ student, courses }) => 
                new DocxRow({
                  children: [
                    ...Object.keys(courses).map(course => 
                      new DocxCell({ 
                        children: [new Paragraph({
                          text: "حاضر",
                          size: 18,
                          color: "2E7D32"
                        })],
                        margins: {
                          top: 150,
                          bottom: 150,
                          left: 150,
                          right: 150,
                        }
                      })
                    ).reverse(),
                    
                    new DocxCell({ 
                      children: [new Paragraph({
                        text: student.diploma_id,
                        size: 18
                      })]
                    }),
                    new DocxCell({ 
                      children: [new Paragraph({
                        text: student.level_id,
                        size: 18
                      })]
                    }),
                    new DocxCell({ 
                      children: [new Paragraph({
                        text: student.national_id,
                        size: 18
                      })]
                    }),
                    new DocxCell({ 
                      children: [new Paragraph({
                        text: student.name,
                        size: 18
                      })]
                    })
                  ]
                })
              )
            ]
          })
        ]
      }]
    });

    Packer.toBlob(doc).then(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `تقرير_حضور_${format(new Date(dateFilter), 'yyyy-MM-dd')}_${branchName}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.national_id.includes(searchTerm)
  );

  const groupedData = filteredData.reduce((acc, item) => {
    if (!acc[item.national_id]) {
      acc[item.national_id] = {
        student: {
          name: item.name,
          national_id: item.national_id,
          level_id: item.level_id,
          diploma_id: item.diploma_id
        },
        courses: {}
      };
    }
    
    acc[item.national_id].courses[item.course] = {
      attendance_time: item.attendance_time,
      attendance_date: item.attendance_date
    };
    
    return acc;
  }, {});

  const allCourses = Array.from(
    new Set(
      filteredData.map(item => item.course)
    )
  ).sort();

  const groupedDataArray = Object.values(groupedData);
  const paginatedData = groupedDataArray.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Get courses for selected student
  const getStudentCourses = (nationalId) => {
    return data
      .filter(item => item.national_id === nationalId)
      .map(item => ({
        course: item.course,
        time: item.attendance_time,
        date: item.attendance_date
      }));
  };

  return (
    <Box>
      <AttendanceSidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      <Box component="main" sx={{ 
        flexGrow: 1,
        p: 4,
        marginRight: '280px',
        minHeight: '100vh',
        backgroundColor: theme.palette.grey[50]
      }}>
        <Paper elevation={0} sx={{ 
          mb: 4,
          p: 3,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          borderRadius: theme.shape.borderRadius
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TodayIcon sx={{ fontSize: 40, ml: 2 }} />
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, fontFamily: '"Cairo", sans-serif' }}>
                التقرير اليومي للحضور
              </Typography>
              <Typography variant="subtitle1" sx={{ fontFamily: '"Cairo", sans-serif' }}>
                {format(new Date(dateFilter), 'EEEE, d MMMM yyyy', { locale: arSA })}
              </Typography>
              <Typography variant="caption" sx={{ fontFamily: '"Cairo", sans-serif', opacity: 0.8 }}>
                الفرع: {branchName}
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton onClick={handleRefresh} sx={{ 
                backgroundColor: theme.palette.primary.dark,
                color: theme.palette.primary.contrastText,
                '&:hover': { backgroundColor: theme.palette.primary.light }
              }}>
                <RefreshIcon />
              </IconButton>
              
              <Button
                variant="contained"
                color="success"
                startIcon={<DownloadIcon />}
                onClick={handleExportWord}
                disabled={groupedDataArray.length === 0}
                sx={{
                  fontFamily: '"Cairo", sans-serif',
                  fontWeight: 600,
                  backgroundColor: theme.palette.success.main,
                  '&:hover': { backgroundColor: theme.palette.success.dark }
                }}
              >
                تصدير كملف Word
              </Button>
            </Box>
          </Box>
        </Paper>

        <Paper elevation={2} sx={{ 
          mb: 4,
          p: 3,
          borderRadius: theme.shape.borderRadius,
          border: `1px solid ${theme.palette.divider}`
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              label="تاريخ الحضور"
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              InputLabelProps={{ 
                shrink: true,
                sx: { fontFamily: '"Cairo", sans-serif' }
              }}
              sx={{ width: 220 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TodayIcon color="action" />
                  </InputAdornment>
                ),
                sx: { fontFamily: '"Cairo", sans-serif' }
              }}
            />
            
            <TextField
              fullWidth
              variant="outlined"
              label="ابحث بالاسم أو رقم الهوية"
              value={searchTerm}
              onChange={handleSearch}
              InputLabelProps={{ sx: { fontFamily: '"Cairo", sans-serif' }}}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                sx: { fontFamily: '"Cairo", sans-serif' }
              }}
              sx={{ maxWidth: 400 }}
            />
          </Box>
        </Paper>

        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '300px' 
          }}>
            <CircularProgress size={60} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ 
            mb: 3,
            fontFamily: '"Cairo", sans-serif',
            '& .MuiAlert-message': { py: 1 }
          }}>
            {error}
          </Alert>
        ) : groupedDataArray.length === 0 ? (
          <Paper elevation={0} sx={{ 
            p: 4, 
            textAlign: 'center',
            border: `1px dashed ${theme.palette.divider}`,
            borderRadius: theme.shape.borderRadius
          }}>
            <TodayIcon color="disabled" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6" sx={{ 
              fontFamily: '"Cairo", sans-serif',
              color: theme.palette.text.secondary
            }}>
              لا توجد سجلات حضور لهذا اليوم في هذا الفرع
            </Typography>
          </Paper>
        ) : (
          <>
            <TableContainer component={Paper} elevation={0} sx={{ 
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: theme.shape.borderRadius,
              overflow: 'hidden'
            }}>
              <Table sx={{ minWidth: 750 }} aria-label="attendance table">
                <TableHead sx={{ bgcolor: theme.palette.grey[100] }}>
                  <TableRow>
                    <StyledTableCell sx={{ fontWeight: 700, textAlign: "right" }}>الطالب</StyledTableCell>
                    <StyledTableCell sx={{ fontWeight: 700, textAlign: "right" }}>رقم الهوية</StyledTableCell>
                    <StyledTableCell sx={{ fontWeight: 700, textAlign: "right" }}>المستوى</StyledTableCell>
                    <StyledTableCell sx={{ fontWeight: 700, textAlign: "right" }}>الدبلوم</StyledTableCell>
                    {/* <StyledTableCell sx={{ fontWeight: 700, textAlign: "center" }}>المواد الحاضرة</StyledTableCell> */}
                    <StyledTableCell sx={{ fontWeight: 700, textAlign: "center" }}>تفاصيل الحضور</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.map(({ student, courses }) => (
                    <StyledTableRow key={student.national_id}>
                      <StyledTableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            sx={{
                              bgcolor: theme.palette.primary.light,
                              width: 36,
                              height: 36,
                              mr: 2,
                              color: theme.palette.primary.dark,
                            }}
                          >
                            <PersonIcon />
                          </Avatar>
                          <Typography sx={{ fontFamily: '"Cairo", sans-serif' }}>
                            {student.name}
                          </Typography>
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IdIcon color="action" sx={{ ml: 1 }} />
                          {student.national_id}
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LevelIcon color="action" sx={{ ml: 1 }} />
                          {student.level_id}
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <DiplomaIcon color="action" sx={{ ml: 1 }} />
                          {student.diploma_id}
                        </Box>
                      </StyledTableCell>
                      {/* <StyledTableCell sx={{ textAlign: "center" }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                          {Object.keys(courses).map(course => (
                            <Chip
                              key={course}
                              label={course}
                              size="small"
                              sx={{ fontFamily: '"Cairo", sans-serif' }}
                            />
                          ))}
                        </Box>
                      </StyledTableCell> */}
                      <StyledTableCell sx={{ textAlign: "center" }}>
                        <IconButton 
                          onClick={() => handleViewDetails(student)}
                          color="primary"
                          aria-label="view attendance details"
                        >
                          <ViewIcon />
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <StyledTablePagination
              component="div"
              count={groupedDataArray.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[10, 15, 25, 50]}
              labelRowsPerPage="صفوف لكل صفحة:"
              labelDisplayedRows={({ from, to, count }) => {
                return `${from}-${to} من ${count !== -1 ? count : `more than ${to}`}`;
              }}
            />
          </>
        )}
      </Box>

      {/* Attendance Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
        sx={{ '& .MuiDialog-paper': { borderRadius: theme.shape.borderRadius } }}
      >
        <DialogTitle sx={{ 
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          fontFamily: '"Cairo", sans-serif',
          fontWeight: 700,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box>
            <Typography style={{fontFamily:"cairo"}} variant="h6" component="span">
              تفاصيل الحضور اليومي
            </Typography>
            <Typography style={{fontFamily:"cairo"}} variant="subtitle1" component="div" sx={{ mt: 1 }}>
              {selectedStudent?.name} - {format(new Date(dateFilter), 'EEEE, d MMMM yyyy', { locale: arSA })}
            </Typography>
          </Box>
          <IconButton onClick={handleCloseDialog} sx={{ color: 'inherit' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {selectedStudent && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                  <Paper elevation={0} sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: theme.shape.borderRadius }}>
                    <Typography variant="subtitle2" sx={{ fontFamily: '"Cairo", sans-serif', color: theme.palette.text.secondary }}>
                      رقم الهوية
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: '"Cairo", sans-serif', fontWeight: 600 }}>
                      {selectedStudent.national_id}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={0} sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: theme.shape.borderRadius }}>
                    <Typography variant="subtitle2" sx={{ fontFamily: '"Cairo", sans-serif', color: theme.palette.text.secondary }}>
                      المستوى
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: '"Cairo", sans-serif', fontWeight: 600 }}>
                      {selectedStudent.level_id}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={0} sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: theme.shape.borderRadius }}>
                    <Typography variant="subtitle2" sx={{ fontFamily: '"Cairo", sans-serif', color: theme.palette.text.secondary }}>
                      الدبلوم
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: '"Cairo", sans-serif', fontWeight: 600 }}>
                      {selectedStudent.diploma_id}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" sx={{ 
                fontFamily: '"Cairo", sans-serif',
                mb: 2,
                color: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center'
              }}>
                <TodayIcon sx={{ ml: 1 }} />
                المواد الحاضرة ({getStudentCourses(selectedStudent.national_id).length})
              </Typography>

              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 2,
                maxHeight: '400px',
                overflowY: 'auto',
                p: 1
              }}>
                {getStudentCourses(selectedStudent.national_id).map((course, index) => (
                  <Paper 
                    key={index} 
                    elevation={0} 
                    sx={{ 
                      p: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: theme.shape.borderRadius,
                      backgroundColor: theme.palette.success.light
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body1" sx={{ fontFamily: '"Cairo", sans-serif', fontWeight: 600 }}>
                        {course.course}
                      </Typography>
                      <Chip 
                        label="حاضر"
                        color="success"
                        size="small"
                        sx={{ fontFamily: '"Cairo", sans-serif', fontWeight: 600 }}
                      />
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="body2" sx={{ fontFamily: '"Cairo", sans-serif', color: theme.palette.text.secondary }}>
                        وقت الحضور:
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: '"Cairo", sans-serif', fontWeight: 600 }}>
                        {course.time}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ fontFamily: '"Cairo", sans-serif', color: theme.palette.text.secondary }}>
                        التاريخ:
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: '"Cairo", sans-serif', fontWeight: 600 }}>
                        {format(new Date(course.date), 'EEEE, d MMMM yyyy', { locale: arSA })}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button 
            onClick={handleCloseDialog}
            variant="contained"
            color="primary"
            sx={{ fontFamily: '"Cairo", sans-serif', fontWeight: 600 }}
          >
            إغلاق
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DailyAttendanceReport;