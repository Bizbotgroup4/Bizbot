import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import TextInput from "../Components/TextInput";
import { useFormik } from "formik";
import * as yup from "yup";
import TextAreaInput from "../Components/TextAreaInput";
import LoadingSpinner from "../Components/LoadingSpinner";
import { sendContactDetailsAPI } from "../API";
import FloatNotification from "../Components/FloatNotification";
const ContactUs = () => {
  const location = useLocation();
  const orgId = new URLSearchParams(location.search).get("id");
  const [isSaving, setIsSaving] = useState(false);
  const [showNotification, setShowNotification] = useState({
    show: false,
    status: "",
    title: "",
    message: <></>,
  });
  const { values, errors, touched, handleChange, handleSubmit, setFieldValue } =
    useFormik({
      initialValues: {
        name: "",
        text: "",
        email: "",
        phone: "",
      },
      validationSchema: yup.object().shape({
        name: yup.string().required("Name can't be empty"),
        text: yup.string().required("Message can't be empty"),
        email: yup.string().required("Email can't be empty"),
        phone: yup.string().required("Phone can't be empty"),
      }),
      onSubmit: () => {
        submitForm();
      },
    });
  const submitForm = async () => {
    if (!orgId) {
      setShowNotification({
        show: true,
        message: <div>URL is malformed. Please request new one.</div>,
        title: "Validation",
        status: "failed",
      });
      return;
    }
    setIsSaving(true);
    await fetch(sendContactDetailsAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: values.name,
        phoneNumber: values.phone,
        email: values.email,
        text: values.text,
        orgId: orgId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setShowNotification({
            show: true,
            message: <div>Your message has been sent.</div>,
            title: "Contact Us",
            status: "success",
          });
        } else {
          setShowNotification({
            show: true,
            message: <div>{data.error}</div>,
            title: "Contact Us",
            status: "failed",
          });
        }
        setIsSaving(false);
      });
  };
  return (
    <div>
      <div className="flex h-screen flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 capitalize text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Contact Us
          </h2>
        </div>

        <div className="mt-10 lg:mx-auto lg:w-2/4">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex gap-10 w-full">
              <TextInput
                id="name"
                label="name"
                name="name"
                type="text"
                value={values.name}
                onChange={handleChange}
                error={errors.name && touched.name}
                errorText={errors.name}
                placeholder="name"
              />
              <TextInput
                id="phone"
                label="phone number"
                name="phone"
                type="text"
                value={values.phone}
                onChange={handleChange}
                error={errors.phone && touched.phone}
                errorText={errors.phone}
                placeholder="phone number"
              />
            </div>
            <div className="flex gap-10 w-full">
              <TextInput
                id="email"
                label="email"
                name="email"
                type="text"
                value={values.email}
                onChange={handleChange}
                error={errors.email && touched.email}
                errorText={errors.email}
                placeholder="email"
              />
            </div>
            <div className="flex gap-10 w-full">
              <TextAreaInput
                id="text"
                label="message"
                name="text"
                value={values.text}
                onChange={handleChange}
                error={errors.text && touched.text}
                errorText={errors.text}
                placeholder="message"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={isSaving}
                className="flex w-full justify-center rounded-md bg-purple-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
              >
                {isSaving ? <LoadingSpinner button={true} /> : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <FloatNotification
        setShowNotification={setShowNotification}
        showNotification={showNotification}
      />
    </div>
  );
};

export default ContactUs;
