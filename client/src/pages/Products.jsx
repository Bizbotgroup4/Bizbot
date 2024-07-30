import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContextStore } from "../context/context";
import DeleteModel from "../Components/DeleteModel";
import FloatNotification from "../Components/FloatNotification";
import Pagination from "../Components/Pagination";
import { productsAPI } from "../API";
import orgTypes from "../constants/orgTypes";
import LoadingSpinner from "../Components/LoadingSpinner";

const Products = () => {
  const navigate = useNavigate();
  const { onboardingData } = ContextStore();
  const [productsData, setProductsData] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [productsId, setProductsId] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [showNotification, setShowNotification] = useState({
    show: false,
    status: "",
    title: "",
    message: <></>,
  });
  const [deleteModel, setDeleteModel] = useState(false);
  let ignore = false;
  const getProducts = async () => {
    const token = localStorage.getItem("bot_customer_token");
    await fetch(productsAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ page: page, orgId: onboardingData._id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.status === "success") {
          setProductsData(data?.data);
          setCount(data.counts);
          setPageCount(data.page);
          setLoaded(true);
        }
      });
  };
  const deleteProducts = () => {
    const token = localStorage.getItem("bot_customer_token");
    if (token) {
      fetch(`${productsAPI}/delete `, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          _id: productsId,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            getProducts();
            setDeleteModel(false);
          } else {
            setShowNotification({
              show: true,
              message: <div>{data.error}</div>,
              title: "Error deleting product",
              status: "failed",
            });
          }
        });
    }
  };
  useEffect(() => {
    if (!ignore && onboardingData?._id) {
      if (onboardingData?.type !== orgTypes.BUSINESS) {
        navigate("/");
        return;
      }
      getProducts();
    }

    return () => {
      ignore = true;
    };
  }, [onboardingData, page]);

  return (
    <div>
      <div className="flex justify-between items-start">
        <div className="text-xl font-bold">Products</div>
        <div
          onClick={() => {
            navigate("/products/add-products");
          }}
          className="text-l border-2 rounded-lg px-6 py-1.5 border-purple-500 font-semibold transition-all duration-300 hover:text-white hover:bg-purple-500 text-purple-500 cursor-pointer flex gap-2 items-center"
        >
          Add Product
        </div>
      </div>
      <div className="my-6 rounded-md w-full">
        <div>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      name
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      description
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      category
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      stock
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      price
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {productsData.length > 0 ? (
                    productsData.map((product, index) => (
                      <tr key={index}>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <div className="flex items-center">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {product?.name}
                            </p>
                          </div>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 line-clamp-2 whitespace-no-wrap">
                            {product?.description}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {product?.category}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 line-clamp-2 whitespace-no-wrap">
                            {product?.stock}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <div className="text-gray-900 line-clamp-2 whitespace-no-wrap">
                            <div className="inline font-semibold">$</div>
                            {product?.price}
                          </div>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white">
                          <div className="flex gap-2">
                            <div className="cursor-pointer">
                              <PencilIcon
                                onClick={() => {
                                  navigate(
                                    `/products/edit-products?id=${product?._id}`
                                  );
                                }}
                                className="h-5 w-5 text-blue-500"
                              />
                            </div>
                            <div className="cursor-pointer">
                              <TrashIcon
                                onClick={() => {
                                  setDeleteModel(true);
                                  setProductsId(product?._id);
                                }}
                                className="h-5 w-5 text-red-500"
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-5 py-5  bg-white text-sm">
                        <div className="w-full text-gray-900 capitalize flex justify-center">
                          {loaded ? "No products found." : <LoadingSpinner />}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <Pagination
                count={count}
                page={page}
                pageCount={pageCount}
                setPage={setPage}
                data={productsData}
              />
            </div>
          </div>
        </div>
      </div>
      <DeleteModel
        handleDelete={deleteProducts}
        setShowModal={setDeleteModel}
        title={"product"}
        showModal={deleteModel}
      />
      <FloatNotification
        setShowNotification={setShowNotification}
        showNotification={showNotification}
      />
    </div>
  );
};

export default Products;
