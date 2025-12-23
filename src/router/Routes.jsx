import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/Main/Main";
import Dashboard from "../Pages/Dashboard/Dashboard";
import PrivateRoute from "./PrivateRoute";
import EmployeeDatabase from "../Pages/Employee/EmployeeDatabase";
import AddNewEmployee from "../Pages/Employee/AddNewEmployee";
import PerformanceReport from "../Pages/Employee/PerformanceReport";
import PerformanceHistory from "../Pages/Employee/PerformanceHistory";
import Payroll from "../Pages/Payroll/Payroll";
import PaySlip from "../Pages/PaySlip/PaySlip";
import Attendance from "../Pages/Attendance/Attendance";
import RequestCenter from "../Pages/Request Center/RequestCenter";
import CareerDatabase from "../Pages/CareerDatabase/CareerDatabase";
import DocumentManager from "../Pages/DocumentManager/DocumentManager";
import NoticeBoard from "../Pages/NoticeBoard/NoticeBoard";
import ActivityLog from "../Pages/Activity Log/ActivityLog";
import ExitInterview from "../Pages/ExitInterview/ExitInterview";
import Profile from "../Pages/Profile/Profile";

export const router = createBrowserRouter([
  // {
  //   path: "/sign-in",
  //   element: <SignIn />,
  // },

  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          {
            path: "/",
            element: <Dashboard />,
          },

          {
            path: "/employee-database",
            element: <EmployeeDatabase />,
          },
          {
            path: "/add-new-employee",
            element: <AddNewEmployee />,
          },
          {
            path: "/performance-report",
            element: <PerformanceReport />,
          },
          {
            path: "/performance-history",
            element: <PerformanceHistory />,
          },
          {
            path: "/payroll",
            element: <Payroll />,
          },
          {
            path: "/pay-slip",
            element: <PaySlip />,
          },
          {
            path: "/attendance",
            element: <Attendance />,
          },
          {
            path: "/request-center",
            element: <RequestCenter />,
          },
          {
            path: "/career-database",
            element: <CareerDatabase />,
          },
             {
            path: "/documents-manager",
            element: <DocumentManager/>,
          },
          {
            path: "/notice-board",
            element: <NoticeBoard/>,
          },
             {
            path: "/activity-log",
            element: <ActivityLog/>,
          },
             {
            path: "/exit-interview",
            element: <ExitInterview/>,
          },
             {
            path: "/profile",
            element: <Profile/>,
          },
        ],
      },
    ],
  },
]);
