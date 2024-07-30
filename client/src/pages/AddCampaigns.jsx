import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import TextInput from "../Components/TextInput";
import TextAreaInput from "../Components/TextAreaInput";
import { campaignsAPI } from "../API";
import LoadingSpinner from "../Components/LoadingSpinner";
import { ContextStore } from "../context/context";
const AddCampaigns = ({ isEdit }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSaving, setIsSaving] = useState(false);
  const { setShowNotification } = ContextStore();

  const campaignsId = new URLSearchParams(location.search).get("id");
  let ignore = false;
  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    resetForm,
    setValues,
  } = useFormik({
    initialValues: {
      name: "",
      description: "",
      category: "",
      donationUrl: "",
      targetQuantity: 1,
    },
    validationSchema: yup.object().shape({
      name: yup.string().required("Name can't be empty"),
      description: yup.string().required("Description can't be empty"),
      category: yup.string().required("Category can't be empty"),
      donationUrl: yup.string().required("Donation url can't be empty"),
      targetQuantity: yup
        .number()
        .min(1)
        .required("Target quantity can't be empty"),
    }),
    onSubmit: async () => {
      setIsSaving(true);
      isEdit ? await updateCampaigns() : await addCampaigns();
      setIsSaving(false);
    },
  });
  const addCampaigns = async () => {
    const token = localStorage.getItem("bot_customer_token");
    await fetch(`${campaignsAPI}/add`, {
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
          navigate("/campaigns");
          setShowNotification({
            show: true,
            message: <div>Campaigns added</div>,
            title: "Campaigns",
            status: "success",
          });
        } else {
          setShowNotification({
            show: true,
            message: <div>{data.error}</div>,
            title: "Error creating campaign",
            status: "failed",
          });
        }
      });
  };
  const updateCampaigns = async () => {
    const token = localStorage.getItem("bot_customer_token");
    await fetch(`${campaignsAPI}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ ...values, _id: campaignsId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          navigate("/campaigns");
          setShowNotification({
            show: true,
            message: <div>Campaigns updated</div>,
            title: "Campaigns",
            status: "success",
          });
        } else {
          setShowNotification({
            show: true,
            message: <div>{data.error}</div>,
            title: "Error updating campaign",
            status: "failed",
          });
        }
      });
  };
  const getCampaignsById = async () => {
    const token = localStorage.getItem("bot_customer_token");
    await fetch(`${campaignsAPI}/by-id`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ _id: campaignsId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.status === "success") {
          setValues({
            category: data?.data?.category ?? "",
            description: data?.data?.description ?? "",
            donationUrl: data?.data?.donationUrl ?? "",
            name: data?.data?.name ?? "",
            targetQuantity: data?.data?.targetQuantity ?? 1,
          });
        }
      });
  };
  useEffect(() => {
    if (campaignsId && isEdit && !ignore) {
      getCampaignsById();
    }
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold">
          {isEdit ? "Edit" : "Add"} Campaign
        </div>
      </div>
      <form className="space-y-6 my-5" onSubmit={handleSubmit}>
        <div className="flex gap-10 w-full ">
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
        </div>
        <div className="flex gap-10 w-full ">
          <TextInput
            id="donationUrl"
            label="donationUrl"
            name="donationUrl"
            type="text"
            value={values.donationUrl}
            onChange={handleChange}
            error={errors.donationUrl && touched.donationUrl}
            errorText={errors.donationUrl}
            placeholder="donationUrl"
          />
          <TextInput
            id="targetQuantity"
            label="Target Quantity"
            name="targetQuantity"
            type="number"
            value={values.targetQuantity}
            onChange={handleChange}
            error={errors.targetQuantity && touched.targetQuantity}
            errorText={errors.targetQuantity}
            placeholder="targetQuantity number"
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
        <div className="flex items-center w-full gap-10">
          <button
            type="submit"
            disabled={isSaving}
            className="flex justify-center w-full py-2 border-2 border-purple-500 text-purple-500 text-lg font-semibold rounded-lg hover:text-white hover:bg-purple-500 transition-all duration-300"
          >
            {isSaving ? <LoadingSpinner button={true} /> : "Save"}
          </button>
          <button
            className="w-full py-1 border-2 border-purple-500 text-purple-500 text-lg font-semibold rounded-lg hover:text-white hover:bg-purple-500 transition-all duration-300"
            onClick={() => {
              navigate("/campaigns");
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCampaigns;
