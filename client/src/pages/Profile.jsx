import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Selection from "../Components/Selection";
import TextAreaInput from "../Components/TextAreaInput";
import TextInput from "../Components/TextInput";
import FloatNotification from "../Components/FloatNotification";
import { ContextStore } from "../context/context";
import { businessType } from "./Onboarding";
import { profileAPI } from "../API";
import LoadingSpinner from "../Components/LoadingSpinner";

const Profile = () => {
  const { onboardingData } = ContextStore();
  const [isSaving, setIsSaving] = useState(false);
  const [selectedType, setSelectedType] = useState({ id: "", name: "" });
  let ignore = false;
  const [showNotification, setShowNotification] = useState({
    show: false,
    status: "",
    title: "",
    message: <></>,
  });
  const { values, errors, touched, handleChange, handleSubmit, setValues } =
    useFormik({
      initialValues: {
        name: "",
        description: "",
        url: "",
        city: "",
        category: "",
        email: "",
        phone: "",
        type: "ngo",
      },
      validationSchema: yup.object().shape({
        name: yup.string().required("Name must be required"),
        description: yup.string().required("Description must be required"),
        url: yup.string().required("Url must be required"),
        city: yup.string().required("City must be required"),
        category: yup.string().required("Category must be required"),
        email: yup.string().required("Email must be required"),
        phone: yup.string().required("Phone must be required"),
        type: yup.string().required("Type must be required"),
      }),
      onSubmit: () => {
        updateProfile();
      },
    });
  const updateProfile = async () => {
    setIsSaving(true);
    const token = localStorage.getItem("bot_customer_token");
    await fetch(`${profileAPI}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ ...values }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setShowNotification({
            show: true,
            message: <div>Profile updated</div>,
            title: "Profile",
            status: "success",
          });
        } else {
          setShowNotification({
            show: true,
            message: <div>{data.error}</div>,
            title: "Backend Error",
            status: "failed",
          });
        }
        setIsSaving(false);
      });
  };
  useEffect(() => {
    if ((!ignore, onboardingData)) {
      setValues({
        category: onboardingData?.category ? onboardingData?.category : "",
        city: onboardingData?.city ? onboardingData?.city : "",
        description: onboardingData?.description
          ? onboardingData?.description
          : "",
        email: onboardingData?.email ? onboardingData?.email : "",
        name: onboardingData?.name ? onboardingData?.name : "",
        phone: onboardingData?.phone ? onboardingData?.phone : "",
        type: onboardingData?.type ? onboardingData?.type : "",
        url: onboardingData?.url ? onboardingData?.url : "",
      });
      setSelectedType(
        businessType.find((item) => item.id === onboardingData?.type)
      );
    }
    return () => {
      ignore = true;
    };
  }, [onboardingData]);

  return (
    <div>
      <div className="flex flex-col gap-5">
        <div className="flex gap-2 justify-start items-center">
          <div className="text-xl font-bold">
            Profile
          </div>
          <div className="text-gray-600 font-semibold">
            ({onboardingData?.type ? selectedType.name : 'Loading...'})
          </div>
        </div>
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
              id="city"
              label="city"
              name="city"
              type="text"
              value={values.city}
              onChange={handleChange}
              error={errors.city && touched.city}
              errorText={errors.city}
              placeholder="city"
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
              id="category"
              label="category"
              name="category"
              type="text"
              value={values.category}
              onChange={handleChange}
              error={errors.category && touched.category}
              errorText={errors.category}
              placeholder="category"
            />
            <TextInput
              id="url"
              label={values.type === "business" ? "web url" : "donation url"}
              name="url"
              type="text"
              value={values.url}
              onChange={handleChange}
              error={errors.url && touched.url}
              errorText={errors.url}
              placeholder="url"
            />
          </div>
          <div className="flex gap-10 w-full">
            <TextAreaInput
              id="description"
              label="description"
              name="description"
              type="text"
              value={values.description}
              onChange={handleChange}
              error={errors.description && touched.description}
              errorText={errors.description}
              placeholder="description"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isSaving}
              className="flex w-full justify-center rounded-md bg-purple-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
            >
              {isSaving ? <LoadingSpinner button={true} /> : "Submit"}
            </button>
          </div>
        </form>
      </div>
      <FloatNotification
        setShowNotification={setShowNotification}
        showNotification={showNotification}
      />
    </div>
  );
};

export default Profile;
