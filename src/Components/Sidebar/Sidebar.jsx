import React from "react";
import {
  Box,
  Drawer,
  Tabs,
  Tab,
  Typography,
  Button,
  useTheme,
  styled
} from "@mui/material";
import {
  Home as HomeIcon,
  Today as DailyIcon,
  CalendarMonth as MonthlyIcon,
  Class as CourseIcon,
  ManageAccounts as ManageAccountsIcon,
  Logout as LogoutIcon,
  AddCircleOutline as AddCourseIcon
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 280;

const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: 48,
  padding: theme.spacing(1.5, 2),
  margin: theme.spacing(0.5, 1.5),
  borderRadius: theme.shape.borderRadius,
  flexDirection: 'row',
  justifyContent: 'flex-start',
  gap: theme.spacing(2),
  transition: 'all 0.2s ease-out',
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.dark,
    '& .MuiTypography-root': {
      fontWeight: 700,
    },
    '& .MuiSvgIcon-root': {
      color: theme.palette.primary.dark,
    }
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  }
}));

const AttendanceSidebar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const selectedTab = location.pathname === "/attendance" ? 0 : 
                     location.pathname === "/daily" ? 1 : 
                     location.pathname === "/monthly" ? 2 :
                     location.pathname === "/courses" ? 3 :
                     location.pathname === "/TeachingData" ? 4 : 0;

  const handleTabChange = (_, newValue) => {
    const routes = ["/attendance", "/daily", "/monthly", "/courses", "/TeachingData"];
    navigate(routes[newValue]);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Drawer
      variant="permanent"
      anchor="right"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: theme.palette.grey[50],
          borderLeft: `1px solid ${theme.palette.divider}`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }
      }}
    >
      {/* Header Section */}
      <Box sx={{ 
        padding: theme.spacing(3),
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexDirection: 'row-reverse' }}>
          <ManageAccountsIcon 
            sx={{ 
              fontSize: 32,
              color: theme.palette.primary.main 
            }} 
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontFamily: '"Cairo", sans-serif',
              color: theme.palette.primary.dark
            }}
          >
            نظام الحضور الذكي
          </Typography>
        </Box>
      </Box>

      {/* Navigation Tabs */}
      <Box sx={{ flexGrow: 1, py: 2 }}>
        <Tabs
          orientation="vertical"
          value={selectedTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTabs-indicator': {
              right: 0,
              left: 'auto',
              backgroundColor: theme.palette.primary.main,
              width: 3,
              borderRadius: '3px 0 0 3px'
            }
          }}
        >
          <StyledTab
            label={
              <Typography 
                variant="subtitle1"
                fontFamily='"Cairo", sans-serif'
                sx={{ 
                  fontSize: '0.9rem',
                }}
              >
                الرئيسية
              </Typography>
            }
            icon={<HomeIcon fontSize="small" />}
          />
          <StyledTab
            label={
              <Typography 
                variant="subtitle1"
                fontFamily='"Cairo", sans-serif'
                sx={{ 
                  fontSize: '0.9rem',
                }}
              >
                التقرير اليومي
              </Typography>
            }
            icon={<DailyIcon fontSize="small" />}
          />
          <StyledTab
            label={
              <Typography 
                variant="subtitle1"
                fontFamily='"Cairo", sans-serif'
                sx={{ 
                  fontSize: '0.9rem',
                }}
              >
                التقرير الشهري
              </Typography>
            }
            icon={<MonthlyIcon fontSize="small" />}
          />
          <StyledTab
            label={
              <Typography 
                variant="subtitle1"
                fontFamily='"Cairo", sans-serif'
                sx={{ 
                  fontSize: '0.9rem',
                }}
              >
                التقرير الحضوري للمقررات
              </Typography>
            }
            icon={<CourseIcon fontSize="small" />}
          />
          <StyledTab
            label={
              <Typography 
                variant="subtitle1"
                fontFamily='"Cairo", sans-serif'
                sx={{ 
                  fontSize: '0.9rem',
                }}
              >
                اضافة مقررات دراسية
              </Typography>
            }
            icon={<AddCourseIcon fontSize="small" />}
          />
        </Tabs>
      </Box>

      {/* Logout Button */}
      <Box sx={{ 
        p: 2, 
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper
      }}>
        <Button
          fullWidth
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            fontFamily: '"Cairo", sans-serif',
            fontWeight: 600,
            py: 1.25,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '0.9rem',
            '& .MuiButton-startIcon': {
              marginRight: "8px",
              marginLeft: 0
            },
            '&:hover': {
              backgroundColor: theme.palette.error.dark,
              boxShadow: 'none'
            }
          }}
        >
          تسجيل الخروج
        </Button>
      </Box>
    </Drawer>
  );
};

export default AttendanceSidebar;