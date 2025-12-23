import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BiChevronDown } from "react-icons/bi";
import employeeIcon from "../../assets/image/employee.png";
import payroll from "../../assets/image/payrollIcone.png";
import dashboardIcon from "../../assets/image/dashboardIcon.png";
import payslipIcon from "../../assets/image/payslip.png";
import attendanceIcon from "../../assets/image/attendance.png";
import requestIcon from "../../assets/image/request.png";
import careerIcon from "../../assets/image/attendance.png";
import documentIcon from "../../assets/image/document.png";
import noticeIcon from "../../assets/image/document.png";
import activityIcon from "../../assets/image/activity.png";
import exitInterview from "../../assets/image/document.png";

const Sidebar = ({ onClose }) => {
  const [openDropdown, setOpenDropdown] = useState("");
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => currentPath === path;
  const isSubActive = (subs = []) =>
    subs.some((sub) => currentPath === sub.Link);

  const menuItems = [
    {
      icon: <img src={dashboardIcon} className="w-5 h-5" />,
      label: "Dashboard",
      Link: "/",
    },
    {
      icon: <img src={employeeIcon} className="w-5 h-5" />,
      label: "Employee",
      isDropdown: true,
      subItems: [
        {
          label: "Employee Database",
          Link: "/employee-database",
        },
        {
          label: "Add New Employee",
          Link: "/add-new-employee",
        },
        {
          label: "Performance Report",
          Link: "/performance-report",
        },
        {
          label: "Performance History",
          Link: "/performance-history",
        },
      ],
    },
    {
      icon: <img src={payroll} className="w-5 h-5" />,
      label: "Payroll",
      Link: "/payroll",
    },
    {
      icon: <img src={payslipIcon} className="w-5 h-5" />,
      label: "Pay Slip",
      Link: "/pay-slip",
    },
    {
      icon: <img src={attendanceIcon} className="w-5 h-5" />,
      label: "Attendance",
      Link: "/attendance",
    },
    {
      icon: <img src={requestIcon} className="w-5 h-5" />,
      label: "Request Center",
      Link: "/request-center",
    },
    {
      icon: <img src={careerIcon} className="w-5 h-5" />,
      label: "Career Database",
      Link: "/career-database",
    },
    {
      icon: <img src={documentIcon} className="w-5 h-5" />,
      label: "Document Manager",
      Link: "/documents-manager",
    },
    {
      icon: <img src={noticeIcon} className="w-5 h-5" />,
      label: "Notice Board",
      Link: "/notice-board",
    },
    {
      icon: <img src={activityIcon} className="w-5 h-5" />,
      label: "Activity Log",
      Link: "/activity-log",
    },
    {
      icon: <img src={exitInterview} className="w-5 h-5" />,
      label: "Exit Interview",
      Link: "/exit-interview",
    },
    {
      icon: <img src={exitInterview} className="w-5 h-5" />,
      label: "Profile",
      Link: "/profile",
    },
  ];

  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.isDropdown && isSubActive(item.subItems)) {
        setOpenDropdown(item.label);
      }
    });
  }, [currentPath]);

  return (
    <div className="flex flex-col h-screen p-3 bg-white w-72">
      <div className="flex-1 overflow-y-auto mt-14">
        {menuItems.map((item) => {
          const activeItem = isActive(item.Link) || isSubActive(item.subItems);

          return (
            <div key={item.label}>
              <div
                onClick={() =>
                  item.isDropdown &&
                  setOpenDropdown(openDropdown === item.label ? "" : item.label)
                }
                className={`relative flex items-center justify-between px-5 py-3 my-2 rounded-md cursor-pointer transition-all
                  ${
                    activeItem
                      ? "bg-[#F5F6FA] text-[#232948] font-semibold"
                      : "text-[#101749]"
                  }
                `}
              >
                {activeItem && (
                  <span className="absolute right-0 top-0 h-full w-[2%] bg-[#FF3E01] rounded-l-md"></span>
                )}

                <Link
                  to={item.Link}
                  className="flex items-center w-full gap-3"
                  onClick={() => onClose?.()}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>

                {item.isDropdown && (
                  <BiChevronDown
                    className={`transition-transform ${
                      openDropdown === item.label ? "rotate-180" : ""
                    }`}
                  />
                )}
              </div>

              {/* ======================== SUB ITEMS========================  */}
              {item.isDropdown && openDropdown === item.label && (
                <div className="pl-8">
                  {item.subItems.map((sub) => (

                    <Link to={sub.Link} key={sub.label} onClick={() => onClose?.()}>
                      <div
                        className={`relative px-4 py-2 my-1 rounded-md transition-all
                          ${
                            isActive(sub.Link)
                              ? "bg-[#F5F6FA] text-[#232948] font-semibold"
                              : "text-[#101749]"
                          }
                        `}
                      >
                        {isActive(sub.Link) && (
                          <span className="absolute top-0 right-0 h-full"></span>
                        )}

                        <p className="flex items-center gap-3">
                          {sub.icon}
                          {sub.label}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
