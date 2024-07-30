import React, { useEffect, useState } from "react";
import FloatNotification from "../Components/FloatNotification";
import TextInput from "../Components/TextInput";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Selection from "../Components/Selection";
import TextAreaInput from "../Components/TextAreaInput";
import { getCustomerAPI, onboardingFormAPI } from "../API";
import orgTypes from "../constants/orgTypes";
import LoadingSpinner from "../Components/LoadingSpinner";
export const businessType = [
  { id: "ngo", name: "NGO" },
  { id: "business", name: "Business" },
];
const Onboarding = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  let ignore = false;
  const [selected, setSelected] = useState(businessType[0]);
  const [loaded, setLoaded] = useState(false);
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
        description: "",
        url: "",
        city: "",
        category: "",
        email: "",
        phone: "",
        type: "ngo",
      },
      validationSchema: yup.object().shape({
        name: yup.string().required("Name can't be empty"),
        description: yup.string().required("Description can't be empty"),
        url: yup.string().required("Url can't be empty"),
        city: yup.string().required("City can't be empty"),
        category: yup.string().required("Category can't be empty"),
        email: yup.string().required("Email can't be empty"),
        phone: yup.string().required("Phone can't be empty"),
        type: yup.string().required("Type can't be empty"),
      }),
      onSubmit: () => {
        submitForm();
      },
    });
  const submitForm = async () => {
    const token = localStorage.getItem("bot_customer_token");
    if (token) {
      setIsSaving(true);
      await fetch(onboardingFormAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(values),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            setShowNotification({
              show: true,
              message: <div>Your organization is on-boarded to BizBot</div>,
              title: "Onboarding",
              status: "success",
            });
            setTimeout(() => {
              switch (data.org_type) {
                case orgTypes.BUSINESS:
                  navigate("/products");
                  break;

                case orgTypes.NGO:
                  navigate("/campaigns");
                  break;

                default:
                  navigate("/onboarding");
              }
              setIsSaving(false);
            }, 3000);
          } else if (data.error) {
            setShowNotification({
              show: true,
              message: <div>{data.error}</div>,
              title: "Error on-boarding your organization",
              status: "failed",
            });
            setIsSaving(false);
          }
        });
    }
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
    if (!ignore && localStorage.getItem("bot_customer_token")) {
      getCustomer();
    }
    return () => {
      ignore = true;
    };
  }, []);
  return (
    <>
      {!loaded ? (
        <LoadingSpinner center={true} />
      ) : (
        <>
          <div className="flex h-screen flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="mt-10 capitalize text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Tell us about your Organization
              </h2>
            </div>

            <div className="mt-10 lg:mx-auto lg:w-2/4">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <Selection
                  label="Organization Type"
                  selected={selected}
                  setSelected={(e) => {
                    setSelected(e);
                    setFieldValue("type", e.id);
                  }}
                  options={businessType}
                />
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
                    label={
                      values.type === "business" ? "web url" : "donation url"
                    }
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
        </>
      )}
    </>
  );
};

export default Onboarding;
