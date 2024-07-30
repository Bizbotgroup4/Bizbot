import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import TextInput from "../Components/TextInput";
import TextAreaInput from "../Components/TextAreaInput";
import { productsAPI } from "../API";
import CreatableInput from "../Components/CreatableInput";
import LoadingSpinner from "../Components/LoadingSpinner";
import { ContextStore } from "../context/context";

const AddProducts = ({ isEdit }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSaving, setIsSaving] = useState(false);
  const { setShowNotification } = ContextStore();
  const productsId = new URLSearchParams(location.search).get("id");
  let ignore = false;
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
      name: "",
      description: "",
      price: 0,
      category: "",
      stock: 0,
      url: "",
      sizes: [],
      colors: [],
    },
    validationSchema: yup.object().shape({
      name: yup.string().required("Name can't be empty"),
      description: yup.string().required("Description can't be empty"),
      category: yup.string().required("Category can't be empty"),
      url: yup.string().required("Website url can't be empty"),
      stock: yup.number().min(0).required("Stock can't be empty"),
    }),
    onSubmit: async () => {
      setIsSaving(true);
      isEdit ? await updateProducts() : await addProducts();
      setIsSaving(false);
    },
  });
  const addProducts = async () => {
    const token = localStorage.getItem("bot_customer_token");
    await fetch(`${productsAPI}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        ...values,
        sizes: values.sizes.map((item) => item.value),
        colors: values.sizes.map((item) => item.value),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          navigate("/products");
          setShowNotification({
            show: true,
            message: <div>Products added</div>,
            title: "Products",
            status: "success",
          });
        } else {
          setShowNotification({
            show: true,
            message: <div>{data.error}</div>,
            title: "Error creating product",
            status: "failed",
          });
        }
      });
  };
  const updateProducts = async () => {
    const token = localStorage.getItem("bot_customer_token");
    await fetch(`${productsAPI}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        ...values,
        _id: productsId,
        sizes: values.sizes.map((item) => item.value),
        colors: values.sizes.map((item) => item.value),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          navigate("/products");
          setShowNotification({
            show: true,
            message: <div>Products updated</div>,
            title: "Products",
            status: "success",
          });
        } else {
          setShowNotification({
            show: true,
            message: <div>{data.error}</div>,
            title: "Error updating product",
            status: "failed",
          });
        }
      });
  };
  const getProductsById = async () => {
    const token = localStorage.getItem("bot_customer_token");
    await fetch(`${productsAPI}/by-id`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ _id: productsId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.status === "success") {
          setValues({
            name: data?.data?.name ?? "",
            description: data?.data?.description ?? "",
            price: data?.data?.price ?? "",
            category: data?.data?.category ?? "",
            stock: data?.data?.stock ?? "",
            url: data?.data?.url ?? "",
            sizes:
              data?.data?.sizes.map((item) => {
                return { value: item, label: item };
              }) ?? "",
            colors:
              data?.data?.colors.map((item) => {
                return { value: item, label: item };
              }) ?? "",
          });
        }
      });
  };
  useEffect(() => {
    if (productsId && isEdit && !ignore) {
      getProductsById();
    }
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold">
          {isEdit ? "Edit" : "Add"} Product
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
            id="url"
            label="Web Url"
            name="url"
            type="text"
            value={values.url}
            onChange={handleChange}
            error={errors.url && touched.url}
            errorText={errors.url}
            placeholder="url"
          />
          <TextInput
            id="stock"
            label="Stock"
            name="stock"
            type="number"
            value={values.stock}
            onChange={handleChange}
            error={errors.stock && touched.stock}
            errorText={errors.stock}
            placeholder="stock"
          />
          <TextInput
            id="price"
            label="Price"
            name="price"
            type="number"
            value={values.price}
            onChange={handleChange}
            error={errors.price && touched.price}
            errorText={errors.price}
            placeholder="Price"
          />
        </div>
        <div className="flex gap-10 w-full ">
          <CreatableInput
            id="sizes"
            label="Size"
            name="sizes"
            placeholder="sizes"
            value={values?.sizes}
            setValue={setFieldValue}
          />
          <CreatableInput
            id="colors"
            label="Color"
            name="colors"
            placeholder="colors"
            value={values?.colors}
            setValue={setFieldValue}
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
            className="w-full py-2 border-2 border-purple-500 text-purple-500 text-lg font-semibold rounded-lg hover:text-white hover:bg-purple-500 transition-all duration-300"
            onClick={() => {
              navigate("/products");
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProducts;
