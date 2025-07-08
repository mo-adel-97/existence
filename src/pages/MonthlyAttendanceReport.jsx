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
  Menu,
  MenuItem,
  Chip,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Today as TodayIcon,
  Person as PersonIcon,
  Badge as IdIcon,
  School as LevelIcon,
  MenuBook as DiplomaIcon,
  Download as DownloadIcon,
  CalendarMonth as MonthIcon,
  Visibility as ViewIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { Document, Paragraph, Packer, AlignmentType, HeadingLevel, Table as DocxTable, TableRow as DocxRow, TableCell as DocxCell, WidthType } from 'docx';
import AttendanceSidebar from '../Components/Sidebar/Sidebar';

// Styled components
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
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
}));

const MonthlyAttendanceReport = () => {
  const theme = useTheme();
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [selectedTab, setSelectedTab] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Get current month dates
  const monthStart = startOfMonth(new Date(selectedMonth));
  const monthEnd = endOfMonth(new Date(selectedMonth));
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Fetch students data from your API
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
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch attendance data
  const fetchAttendanceData = async () => {
    try {
      const response = await fetch('https://filesregsiteration.sstli.com/get_attendance.php');
      const result = await response.json();

      if (result.success) {
        // Filter attendance data for selected month and students in our branch
        const filteredData = result.data.filter(item => {
          const attendanceDate = parseISO(item.attendance_date);
          return isWithinInterval(attendanceDate, { start: monthStart, end: monthEnd });
        });
        
        setAttendanceData(filteredData);
      } else {
        throw new Error('Failed to fetch attendance data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchStudents();
      await fetchAttendanceData();
    };
    loadData();
  }, [selectedMonth]);

  const handleRefresh = () => {
    setLoading(true);
    fetchStudents();
    fetchAttendanceData();
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
      description: "تقرير الحضور الشهري",
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
            text: "تقرير الحضور الشهري",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            bold: true,
            size: 28
          }),
          new Paragraph({
            text: `الشهر: ${format(new Date(selectedMonth), 'MMMM yyyy', { locale: arSA })}`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 800 },
            size: 22
          }),
          new DocxTable({
            width: { size: 100, type: WidthType.PERCENTAGE },
            margins: { top: 400, bottom: 400, left: 400, right: 400 },
            columnWidths: [3000, 2500, 2000, 2000, 2000, ...monthDays.map(() => 1000)],
            rows: [
              new DocxRow({
                children: [
                  ...monthDays.map(day => 
                    new DocxCell({
                      children: [new Paragraph({
                        text: format(day, 'd', { locale: arSA }),
                        bold: true,
                        size: 16
                      })],
                      shading: { fill: "4472C4" }
                    })
                  ).reverse(),
                  new DocxCell({
                    children: [new Paragraph({
                      text: "الدبلوم",
                      bold: true,
                      size: 20
                    })],
                    shading: { fill: "4472C4" }
                  }),
                  new DocxCell({
                    children: [new Paragraph({
                      text: "المستوى", 
                      bold: true,
                      size: 20
                    })],
                    shading: { fill: "4472C4" }
                  }),
                  new DocxCell({
                    children: [new Paragraph({
                      text: "رقم الهوية",
                      bold: true,
                      size: 20
                    })],
                    shading: { fill: "4472C4" }
                  }),
                  new DocxCell({
                    children: [new Paragraph({
                      text: "الاسم",
                      bold: true, 
                      size: 20
                    })],
                    shading: { fill: "4472C4" }
                  })
                ]
              }),
              ...filteredStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(student => 
                new DocxRow({
                  children: [
                    ...monthDays.map(day => {
                      const attended = attendanceData.some(a => 
                        a.national_id === student.nationalId && 
                        format(parseISO(a.attendance_date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
                      );
                      return new DocxCell({ 
                        children: [new Paragraph({
                          text: attended ? "حاضر" : "غائب",
                          size: 14,
                          color: attended ? "2E7D32" : "D32F2F"
                        })]
                      });
                    }).reverse(),
                    new DocxCell({ 
                      children: [new Paragraph({
                        text: student.diplomName,
                        size: 18
                      })]
                    }),
                    new DocxCell({ 
                      children: [new Paragraph({
                        text: student.levelName,
                        size: 18
                      })]
                    }),
                    new DocxCell({ 
                      children: [new Paragraph({
                        text: student.nationalId,
                        size: 18
                      })]
                    }),
                    new DocxCell({ 
                      children: [new Paragraph({
                        text: student.studentName,
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
      link.download = `تقرير_حضور_${format(new Date(selectedMonth), 'yyyy-MM')}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.nationalId.includes(searchTerm)
  );

  // Check if student attended on specific day
  const didStudentAttend = (studentId, day) => {
    return attendanceData.some(a => 
      a.national_id === studentId && 
      format(parseISO(a.attendance_date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
  };

  // Calculate attendance percentage for a student
  const calculateAttendancePercentage = (studentId) => {
    const attendedDays = monthDays.filter(day => 
      didStudentAttend(studentId, day)
    ).length;
    return Math.round((attendedDays / monthDays.length) * 100);
  };

  // Get attendance details for a student
  const getStudentAttendanceDetails = (studentId) => {
    return monthDays.map(day => ({
      date: day,
      attended: didStudentAttend(studentId, day),
      formattedDate: format(day, 'EEEE, d MMMM yyyy', { locale: arSA })
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
            <MonthIcon sx={{ fontSize: 40, ml: 2 }} />
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, fontFamily: '"Cairo", sans-serif' }}>
                التقرير الشهري للحضور
              </Typography>
              <Typography variant="subtitle1" sx={{ fontFamily: '"Cairo", sans-serif' }}>
                {format(new Date(selectedMonth), 'MMMM yyyy', { locale: arSA })}
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
            <FormControl sx={{ minWidth: 220 }}>
              <InputLabel sx={{ fontFamily: '"Cairo", sans-serif' }}>اختر الشهر</InputLabel>
              <Select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                label="اختر الشهر"
                inputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MonthIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ fontFamily: '"Cairo", sans-serif' }}
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const date = new Date();
                  date.setMonth(date.getMonth() - i);
                  const monthValue = format(date, 'yyyy-MM');
                  const monthName = format(date, 'MMMM yyyy', { locale: arSA });
                  return (
                    <MenuItem key={monthValue} value={monthValue} sx={{ fontFamily: '"Cairo", sans-serif' }}>
                      {monthName}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            
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
        ) : filteredStudents.length === 0 ? (
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
              لا توجد بيانات متاحة للعرض
            </Typography>
          </Paper>
        ) : (
          <>
            <Box sx={{ overflowX: 'auto' }}>
              <TableContainer component={Paper} elevation={0} sx={{ 
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: theme.shape.borderRadius,
              }}>
                <Table stickyHeader aria-label="monthly attendance table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell sx={{ 
                        fontWeight: 700, 
                        textAlign: "right",
                        position: 'sticky',
                        left: 0,
                        zIndex: 2,
                        backgroundColor: theme.palette.grey[100]
                      }}>
                        الطالب
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: 700, textAlign: "right" }}>رقم الهوية</StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: 700, textAlign: "right" }}>المستوى</StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: 700, textAlign: "right" }}>الدبلوم</StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: 700, textAlign: "center" }}>نسبة الحضور</StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: 700, textAlign: "center" }}>تفاصيل الحضور</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(student => (
                      <StyledTableRow key={student.nationalId}>
                        <StyledTableCell sx={{ 
                          position: 'sticky',
                          left: 0,
                          zIndex: 1,
                          backgroundColor: theme.palette.background.paper
                        }}>
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
                              {student.studentName}
                            </Typography>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IdIcon color="action" sx={{ ml: 1 }} />
                            {student.nationalId}
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LevelIcon color="action" sx={{ ml: 1 }} />
                            {student.levelName}
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <DiplomaIcon color="action" sx={{ ml: 1 }} />
                            {student.diplomName}
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: 'center' }}>
                          <Chip 
                            label={`${calculateAttendancePercentage(student.nationalId)}%`}
                            color={
                              calculateAttendancePercentage(student.nationalId) >= 80 ? 'success' :
                              calculateAttendancePercentage(student.nationalId) >= 50 ? 'warning' : 'error'
                            }
                            sx={{ fontFamily: '"Cairo", sans-serif', fontWeight: 600 }}
                          />
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: 'center' }}>
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
            </Box>

            <StyledTablePagination
              component="div"
              count={filteredStudents.length}
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
            <Typography variant="h6" component="span">
              تفاصيل الحضور الشهري
            </Typography>
            <Typography variant="subtitle1" component="div" sx={{ mt: 1 }}>
              {selectedStudent?.studentName} - {format(new Date(selectedMonth), 'MMMM yyyy', { locale: arSA })}
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
                      {selectedStudent.nationalId}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={0} sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: theme.shape.borderRadius }}>
                    <Typography variant="subtitle2" sx={{ fontFamily: '"Cairo", sans-serif', color: theme.palette.text.secondary }}>
                      المستوى
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: '"Cairo", sans-serif', fontWeight: 600 }}>
                      {selectedStudent.levelName}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={0} sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: theme.shape.borderRadius }}>
                    <Typography variant="subtitle2" sx={{ fontFamily: '"Cairo", sans-serif', color: theme.palette.text.secondary }}>
                      الدبلوم
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: '"Cairo", sans-serif', fontWeight: 600 }}>
                      {selectedStudent.diplomName}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ 
                fontFamily: '"Cairo", sans-serif',
                mb: 2,
                color: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center'
              }}>
                <TodayIcon sx={{ ml: 1 }} />
                أيام الحضور ({calculateAttendancePercentage(selectedStudent.nationalId)}%)
              </Typography>

              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: 2,
                maxHeight: '400px',
                overflowY: 'auto',
                p: 1
              }}>
                {getStudentAttendanceDetails(selectedStudent.nationalId).map((day, index) => (
                  <Paper 
                    key={index} 
                    elevation={0} 
                    sx={{ 
                      p: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: theme.shape.borderRadius,
                      backgroundColor: day.attended ? theme.palette.success.light : theme.palette.error.light
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body1" sx={{ fontFamily: '"Cairo", sans-serif' }}>
                        {day.formattedDate}
                      </Typography>
                      <Chip 
                        label={day.attended ? "حاضر" : "غائب"}
                        color={day.attended ? "success" : "error"}
                        size="small"
                        sx={{ fontFamily: '"Cairo", sans-serif', fontWeight: 600 }}
                      />
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

export default MonthlyAttendanceReport;