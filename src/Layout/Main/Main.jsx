import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { ConfigProvider, Drawer } from "antd";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoIosNotificationsOutline, IoMdClose } from "react-icons/io";
import defaultImage from "../../assets/image/superadmin.png";
import logo from "../../assets/image/Logo.png";

const MainLayout = () => {
  const [open, setOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const adminProfile = {
    name: "Asif Riaj",
    role: "Hr Admin",
    image: defaultImage,
  };

  // =======================Update the time every second=======================
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ===========================Format the date and time===========================
  const formatTime = (date) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    const dateString = date.toLocaleDateString("en-US", options);
    const timeString = date.toLocaleTimeString("en-US", { hour12: false });
    return `${dateString} ${timeString}`;
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex flex-col">
      {/* =====================Header =====================*/}
      <header className="fixed top-0 left-0 z-10 shadow-sm w-full bg-[#fff]">
        <div className="flex justify-between py-4 ">
          <div className="flex items-center gap-8 ml-8">
            <Link to={"/"}>
              <img src={logo} alt="logo" className="ml-0 md:ml-10 " />
            </Link>

            <div className="hidden ml-10 md:block">
              <p>Good Afternoon {adminProfile.name}</p>
              <p className="text-sm text-gray-500">
                Time: {formatTime(currentTime)}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="border-r-2 border-[#8C92AF] mr-3">
              <IoIosNotificationsOutline size={25} color="#8C92AF" />
            </div>

            <div className="flex items-center gap-4 cursor-pointer md:mr-8">
              <div className="hidden text-right md:block">
                <p>{adminProfile.name}</p>
                <p className="text-sm text-gray-500 capitalize">
                  {adminProfile.role}
                </p>
              </div>
              <div className="items-center justify-center hidden w-10 h-10 overflow-hidden bg-gray-100 rounded-full md:flex">
                <img
                  src={adminProfile.image}
                  alt="admin"
                  className="object-cover w-10 h-10"
                />
              </div>

              <button className="block mr-5 lg:hidden" onClick={showDrawer}>
                <RxHamburgerMenu className="text-2xl text-black" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/*========================= Sidebar for large screens =========================*/}
        <div className="fixed left-0 hidden w-64 h-full bg-white shadow-md lg:block">
          <Sidebar adminProfile={adminProfile} />
        </div>

        {/* ===========================Mobile Drawer ===========================*/}
        <ConfigProvider
          theme={{
            components: {
              Drawer: {
                colorBgElevated: "#FFFFFF",
              },
            },
          }}
        >
          <Drawer
            placement="right"
            width="100%"
            onClose={onClose}
            open={open}
            closeIcon={<IoMdClose className="text-2xl" />}
          >
            <Sidebar adminProfile={adminProfile} onClose={onClose} />
          </Drawer>
        </ConfigProvider>

        {/*======================== Main Content - Adjusted for Sidebar ========================*/}
        <div className="flex-1 p-5 overflow-y-auto lg:ml-72">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
