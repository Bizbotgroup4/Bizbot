import { Bars3Icon, HomeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import WebContext, { ContextStore } from "../context/context";
import { useLocation, useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const { onboardingData } = ContextStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [showSideBar, setShowSideBar] = useState(false);
  const routes = [
    ...(onboardingData?.type === "ngo"
      ? [
          {
            name: "campaigns",
            activeName: "campaigns",
            icon: HomeIcon,
            link: "/campaigns",
          },
        ]
      : [
          {
            name: "Products",
            activeName: "products",
            icon: HomeIcon,
            link: "/products",
          },
        ]),
    {
      name: "Twilio",
      activeName: "twilio",
      icon: HomeIcon,
      link: "/twilio",
    },
    {
      name: "Profile",
      activeName: "profile",
      icon: HomeIcon,
      link: "/profile",
    },
  ];
  return (
    <div>
      <div className="bg-gray-100 min-h-[100vh] flex">
        <div
          className={`bg-white z-50 flex flex-col justify-between min-h-[100vh] shadow-xl absolute w-4/5 md:w-2/5 lg:static transition-all duration-300 ${
            showSideBar ? "translate-x-0" : "-translate-x-96"
          } lg:translate-x-0 lg:w-1/3 xl:w-1/5`}
        >
          <div>
            <div className="flex justify-center py-10 gap-5 mx-5 text-2xl font-bold">
              <img
                className="mx-auto h-16 w-auto"
                src="/logo512.png"
                alt="BizBot Logo"
              />
            </div>
            <div className="flex justify-center flex-col gap-5 mx-5">
              {routes.map((item, ind) => (
                <div
                  key={ind}
                  onClick={() => {
                    navigate(item.link);
                    setShowSideBar(!showSideBar);
                  }}
                  className={`hover:bg-purple-500 capitalize ${
                    location.pathname.split("/")[1] === item.activeName &&
                    "bg-purple-500 shadow-xl text-white"
                  } hover:text-white cursor-pointer px-2 py-2 hover:shadow-xl rounded-lg`}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
          <div className="mx-5 my-5">
            <div
              onClick={() => {
                localStorage.removeItem("bot_customer_token");
                window.location.reload();
              }}
              className={`hover:bg-purple-500 capitalize hover:text-white cursor-pointer px-2 py-2 hover:shadow-xl rounded-lg`}
            >
              Logout
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="h-20 flex justify-between items-center bg-white w-full px-10 font-semibold text-lg">
            <div className="flex-col">
              <div className="">BizBot Dashboard</div>
              <div className="text-sm text-gray-600">{
                onboardingData?.name ? `[${onboardingData.name}]` : "Loading..."
              }</div>
            </div>
            <div
              onClick={() => {
                setShowSideBar(!showSideBar);
              }}
              className="cursor-pointer block lg:hidden"
            >
              {showSideBar ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </div>
          </div>
          <div className="mt-10 px-10">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
