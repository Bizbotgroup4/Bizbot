import React, { useEffect, useRef, useState } from "react";
import TextInput from "../Components/TextInput";
import { useFormik } from "formik";
import * as yup from "yup";
import { ContextStore } from "../context/context";
import { baseURL, twilioConfigAPI } from "../API";
import FloatNotification from "../Components/FloatNotification";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import LoadingSpinner from "../Components/LoadingSpinner";
const Twilio = () => {
  const { onboardingData, twilioConfig, setTwilioConfig } = ContextStore();
  const [isSaving, setIsSaving] = useState(false);
  const [showNotification, setShowNotification] = useState({
    show: false,
    status: "",
    title: "",
    message: <></>,
  });
  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    resetForm,
    setValues,
    setFieldValue,
  } = useFormik({
    initialValues: {
      authToken: "",
      accountSid: "",
      phone: "",
    },
    validationSchema: yup.object().shape({
      authToken: yup
        .string()
        .required("Auth token can't be empty")
        .matches(/^[a-zA-Z0-9]{32}$/, "Invalid auth token"),
      accountSid: yup
        .string()
        .required("Account SID can't be empty")
        .matches(/^AC[0-9a-fA-F]{32}$/, "Invalid SID"),
      phone: yup.string().required("Phone number can't be empty"),
    }),
    onSubmit: () => {
      updateTwilio();
    },
  });
  useEffect(() => {
    if (twilioConfig?.phone) {
      setFieldValue("phone", twilioConfig?.phone);
      setFieldValue("accountSid", twilioConfig?.accountSid);
      setFieldValue("authToken", twilioConfig?.authToken);
    }
  }, [twilioConfig]);
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
  const updateTwilio = async () => {
    setIsSaving(true);
    const token = localStorage.getItem("bot_customer_token");
    await fetch(`${twilioConfigAPI}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        ...values,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setShowNotification({
            show: true,
            message: <div>Configuration updated</div>,
            title: "Success",
            status: "success",
          });
          getTwilio();
        } else {
          setShowNotification({
            show: true,
            message: <div>{data.error}</div>,
            title: "Error configuring twilio",
            status: "failed",
          });
        }
        setIsSaving(false);
      });
  };
  return (
    <div>
      <div className="flex flex-col xl:flex-row gap-10 w-full">
        <div className="w-full">
          <div className="flex justify-between items-start">
            <div className="text-xl font-bold">Twilio Configuration</div>
          </div>
          <form className="space-y-6 my-6 w-full " onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 w-full">
              <TextInput
                id="phone"
                label="Phone Number"
                name="phone"
                type="text"
                value={values.phone}
                onChange={handleChange}
                error={errors.phone && touched.phone}
                errorText={errors.phone}
                placeholder="Phone Number"
              />
              <TextInput
                id="authToken"
                label="Auth Token"
                name="authToken"
                type="text"
                value={values.authToken}
                onChange={handleChange}
                error={errors.authToken && touched.authToken}
                errorText={errors.authToken}
                placeholder="Auth Token"
              />
              <TextInput
                id="accountSid"
                label="Account SID"
                name="accountSid"
                type="text"
                value={values.accountSid}
                onChange={handleChange}
                error={errors.accountSid && touched.accountSid}
                errorText={errors.accountSid}
                placeholder="Account SID"
              />
            </div>
            <div className="flex items-center w-full gap-10">
              <button
                type="submit"
                disabled={isSaving}
                className="flex justify-center w-full py-1 border-2 border-purple-500 text-purple-500 text-lg font-semibold rounded-lg hover:text-white hover:bg-purple-500 transition-all duration-300"
              >
                {isSaving ? <LoadingSpinner button={true} /> : "Save"}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6 w-full border-t-2 border-t-gray-200 pt-10 xl:border-l-2 xl:border-t-0 xl:border-l-gray-200 xl:pl-10 xl:pt-0">
          <div className="flex flex-col justify-between items-start">
            <div className="text-xl font-bold">Twilio Url</div>
            <div className="text-sm">URL to be configured under input named "When a message comes in" at Twilio.</div>
          </div>
          <div className="w-full flex justify-start xl:justify-center items-center">
            <div className="w-full border-2 px-3 py-2 bg-white rounded-lg break-words text-wrap flex justify-between items-center gap-2">
              <p className="break-all">
                {onboardingData ? `${baseURL}/webhook?id=${onboardingData._id}` : 'Loading...'}
              </p>
              <div
                className={`cursor-pointer ${onboardingData == null ? 'hidden' : ''}`}
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${baseURL}/webhook?id=${onboardingData._id}`
                  );
                  setShowNotification({
                    show: true,
                    message: <div>Copied to the clipboard!</div>,
                    title: "Success",
                    status: "success",
                  });
                }}
              >
                <ClipboardDocumentCheckIcon className="h-5 w-5" />
              </div>
            </div>
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

export default Twilio;
