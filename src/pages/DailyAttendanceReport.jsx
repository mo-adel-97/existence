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
  Checkbox,
  useTheme,
  styled,
  TablePagination,
  Button,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Today as TodayIcon,
  Person as PersonIcon,
  Badge as IdIcon,
  School as LevelIcon,
  MenuBook as DiplomaIcon,
  Class as CourseIcon,
  Download as DownloadIcon
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTab, setSelectedTab] = useState(0);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://filesregsiteration.sstli.com/get_attendance.php');
      const result = await response.json();

      if (result.success) {
        const todayData = result.data.filter(item => 
          item.attendance_date === dateFilter
        );
        setData(todayData);
        
        const initialStatus = {};
        todayData.forEach(item => {
          initialStatus[`${item.national_id}-${item.course}`] = true;
        });
        setAttendanceStatus(initialStatus);
      } else {
        throw new Error('فشل في جلب البيانات من الخادم');
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

  const handleAttendanceChange = (nationalId, course) => {
    setAttendanceStatus(prev => ({
      ...prev,
      [`${nationalId}-${course}`]: !prev[`${nationalId}-${course}`]
    }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

const handleExportWord = () => {
  handleMenuClose();

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
        direction: "rtl" // Set entire document to RTL
      },
      children: [
        // Title and date header
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
          spacing: { after: 800 },
          size: 22
        }),

        // Main table - now larger and with inverted columns
        new DocxTable({
          width: { size: 100, type: WidthType.PERCENTAGE },
          margins: {
            top: 400,
            bottom: 400,
            left: 400,
            right: 400,
          },
          columnWidths: [
            3000, // Course columns (right side - now first)
            ...Object.keys(groupedDataArray[0]?.courses || {}).map(() => 2000),
            2500, // Student info columns (left side)
            2000,
            2000,
            2000
          ],
          rows: [
            // Header row with inverted columns (courses first)
            new DocxRow({
              children: [
                // Course headers (right side - now first)
                ...Object.keys(groupedDataArray[0]?.courses || {}).map(course => 
                  new DocxCell({
                    children: [new Paragraph({
                      text: course,
                      bold: true,
                      size: 20
                    })],
                    shading: {
                      fill: "4472C4", // Blue background
                    },
                    margins: {
                      top: 200,
                      bottom: 200,
                      left: 200,
                      right: 200,
                    }
                  })
                ).reverse(),
                
                // Student info headers (left side)
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
            
            // Student data rows with inverted columns
            ...groupedDataArray.map(({ student, courses }) => 
              new DocxRow({
                children: [
                  // Attendance status cells (courses first - right side)
                  ...Object.keys(courses).map(course => 
                    new DocxCell({ 
                      children: [new Paragraph({
                        text: attendanceStatus[`${student.national_id}-${course}`] ? "حاضر" : "غائب",
                        size: 18
                      })],
                      margins: {
                        top: 150,
                        bottom: 150,
                        left: 150,
                        right: 150,
                      }
                    })
                  ).reverse(),
                  
                  // Student info cells (left side)
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

  // Generate and download the Word file
  Packer.toBlob(doc).then(blob => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `تقرير_حضور_${format(new Date(dateFilter), 'yyyy-MM-dd')}.docx`;
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
    const key = `${item.national_id}-${item.name}`;
    if (!acc[key]) {
      acc[key] = {
        student: item,
        courses: {}
      };
    }
    acc[key].courses[item.course] = item;
    return acc;
  }, {});

  const groupedDataArray = Object.values(groupedData);
  const paginatedData = groupedDataArray.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
              لا توجد سجلات حضور لهذا اليوم
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
                    {Object.keys(groupedDataArray[0]?.courses || {}).map(course => (
                      <StyledTableCell key={course} sx={{ fontWeight: 700, textAlign: "center" }}>
                        {course}
                      </StyledTableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.map(({ student, courses }) => (
                    <StyledTableRow key={`${student.national_id}-${student.name}`}>
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
                      {Object.keys(courses).map(course => (
                        <StyledTableCell key={`${student.national_id}-${course}`} sx={{ textAlign: "center" }}>
                          <Checkbox
                            checked={attendanceStatus[`${student.national_id}-${course}`] || false}
                            onChange={() => handleAttendanceChange(student.national_id, course)}
                            color="primary"
                            inputProps={{ 'aria-label': `attendance for ${course}` }}
                          />
                        </StyledTableCell>
                      ))}
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
    </Box>
  );
};

export default DailyAttendanceReport;