import React, { createContext, useContext, useEffect, useState } from "react";
import { getCustomerAPI, profileAPI, twilioConfigAPI } from "../API";
import { useNavigate } from "react-router-dom";
import FloatNotification from "../Components/FloatNotification";

const Context = createContext({
  onboardingData: null,
  twilioConfig: null,
  setTwilioConfig: () => {},
  setShowNotification: () => {},
});

const WebContext = ({ children }) => {
  const [onboardingData, setOnboardingData] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [twilioConfig, setTwilioConfig] = useState(null);
  const [showNotification, setShowNotification] = useState({
    show: false,
    status: "",
    title: "",
    message: <></>,
  });
  const token = localStorage.getItem("bot_customer_token");
  const navigate = useNavigate();
  let ignore = false;
  const getOnboardingDetails = async () => {
    await fetch(profileAPI, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.status === "success") {
          setOnboardingData(data.organization);
        }
      });
  };
  const getCustomer = async () => {
    const token = localStorage.getItem("bot_customer_token");
    await fetch(getCustomerAPI, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          if (data.data.is_onboarded) {
            getOnboardingDetails();
            setCustomerDetails(data?.data?.user);
          } else {
            navigate("/onboarding");
          }
        } else if (data.error) {
          setShowNotification({
            show: true,
            message: <div>{data.error}</div>,
            title: "Server Error",
            status: "failed",
          });
        }
      });
  };
  const getTwilio = async () => {
    const token = localStorage.getItem("bot_customer_token");
    await fetch(twilioConfigAPI, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTwilioConfig(data.data);
      });
  };
  useEffect(() => {
    if (!ignore) {
      getCustomer();
      getTwilio();
    }

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <Context.Provider
      value={{
        onboardingData,
        twilioConfig,
        setTwilioConfig,
        setShowNotification,
      }}
    >
      {children}
      <FloatNotification
        setShowNotification={setShowNotification}
        showNotification={showNotification}
      />
    </Context.Provider>
  );
};
export default WebContext;

export const ContextStore = () => {
  return useContext(Context);
};
