import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import TextInput from "../Components/TextInput";
import { useNavigate } from "react-router-dom";
import { getCustomerAPI, loginAPI } from "../API";
import FloatNotification from "../Components/FloatNotification";
import orgTypes from "../constants/orgTypes";
import LoadingSpinner from "../Components/LoadingSpinner";

const Login = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showNotification, setShowNotification] = useState({
    show: false,
    status: "",
    title: "",
    message: <></>,
  });
  const { values, errors, touched, handleChange, handleSubmit } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object().shape({
      email: yup
        .string()
        .email("Please enter a valid email")
        .required("Email can't be empty"),
      password: yup.string().required("Password can't be empty"),
    }),
    onSubmit: () => {
      login();
    },
  });
  const login = async () => {
    setIsSaving(true);
    await fetch(loginAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          navigate("/onboarding");
          localStorage.setItem("bot_customer_token", data?.data?.token);
        } else if (data.error) {
          setShowNotification({
            show: true,
            message: <div>{data.error}</div>,
            title: "Error in login",
            status: "failed",
          });
        }
        setIsSaving(false);
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
            switch (data.data.org_type) {
              case orgTypes.BUSINESS:
                navigate("/products");
                break;

              case orgTypes.NGO:
                navigate("/campaigns");
                break;

              default:
                navigate("/onboarding");
            }
          } else {
            navigate("/onboarding");
          }
        } else if (data.error) {
          setShowNotification({
            show: true,
            message: <div>{data.error}</div>,
            title: "Error fetching user info",
            status: "failed",
          });
        }
        setLoaded(true);
      });
  };
  useEffect(() => {
    if (localStorage.getItem("bot_customer_token")) {
      getCustomer();
    } else {
      setLoaded(true);
    }
  }, []);

  return (
    <div>
      {!loaded ? (
        <LoadingSpinner center={true} />
      ) : (
        <>
          <div className="flex h-screen flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <img
                className="mx-auto h-16 w-auto"
                src="/logo512.png"
                alt="BizBot Logo"
              />
              <h2 className="mt-10 capitalize text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Sign in to your account
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <TextInput
                  id="email"
                  label="email"
                  name="email"
                  type="text"
                  value={values.email}
                  onChange={handleChange}
                  error={errors.email && touched.email}
                  errorText={errors.email}
                  placeholder="yourname@example.com"
                />
                <TextInput
                  id="password"
                  label="password"
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  error={errors.password && touched.password}
                  errorText={errors.password}
                  placeholder="password"
                />
                <div>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex w-full justify-center rounded-md bg-purple-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                  >
                    {isSaving ? <LoadingSpinner button={true} /> : "Sign In"}
                  </button>
                </div>
              </form>

              <div className="mt-10 text-center text-sm text-gray-500 ">
                Not a member?{" "}
                <span
                  onClick={() => {
                    navigate("/register");
                  }}
                  className="font-semibold cursor-pointer leading-6 text-purple-600 hover:text-purple-500"
                >
                  Register
                </span>
              </div>
            </div>
          </div>
          <FloatNotification
            setShowNotification={setShowNotification}
            showNotification={showNotification}
          />
        </>
      )}
    </div>
  );
};

export default Login;
