import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import TextInput from "../Components/TextInput";
import { useNavigate } from "react-router-dom";
import FloatNotification from "../Components/FloatNotification";
import { registerAPI } from "../API";
import LoadingSpinner from "../Components/LoadingSpinner";
const Register = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [showNotification, setShowNotification] = useState({
    show: false,
    status: "",
    title: "",
    message: <></>,
  });
  const navigation = useNavigate();
  const { values, errors, touched, handleChange, handleSubmit } = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirm_password: "",
    },
    validationSchema: yup.object().shape({
      email: yup
        .string()
        .email("Please enter a valid email")
        .required("Email can't be empty"),
      password: yup.string().required("Password can't be empty"),
      confirm_password: yup
        .string()
        .required("Confirm password can't be empty"),
    }),
    onSubmit: async () => {
      setIsSaving(true);
      await register();
    },
  });

  const register = async () => {
    if (values.password !== values.confirm_password) {
      setShowNotification({
        show: true,
        message: <div>Password and confirm password do not match</div>,
        title: "Password Validation",
        status: "failed",
      });
      setIsSaving(false);
    } else {
      await fetch(registerAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            setShowNotification({
              show: true,
              message: <div>You account is created, please login now.</div>,
              title: "Register",
              status: "success",
            });
            setTimeout(() => {
              navigate("/");
              setIsSaving(false);
            }, 2000);
          } else if (data.error) {
            setShowNotification({
              show: true,
              message: <div>{data.error}</div>,
              title: "Error registering your account",
              status: "failed",
            });
            setIsSaving(false);
          }
        });
    }
  };
  return (
    <div>
      <div className="flex h-screen flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-16 w-auto"
            src="/logo512.png"
            alt="BizBot Logo"
          />
          <h2 className="mt-10 capitalize text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign up your account
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
            <TextInput
              id="confirm_password"
              label="Confirm Password"
              name="confirm_password"
              type="password"
              value={values.confirm_password}
              onChange={handleChange}
              error={errors.confirm_password && touched.confirm_password}
              errorText={errors.confirm_password}
              placeholder="confirm password"
            />
            <div>
              <button
                type="submit"
                disabled={isSaving}
                className="flex w-full justify-center rounded-md bg-purple-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
              >
                {isSaving ? <LoadingSpinner button={true} /> : "Register"}
              </button>
            </div>
          </form>

          <div className="mt-10 text-center text-sm text-gray-500 ">
            Already have an account?{" "}
            <span
              onClick={() => {
                navigation("/");
              }}
              className="font-semibold leading-6 cursor-pointer text-purple-600 hover:text-purple-500"
            >
              Login
            </span>
          </div>
        </div>
      </div>
      <FloatNotification
        setShowNotification={setShowNotification}
        showNotification={showNotification}
      />
    </div>
  );
};

export default Register;
