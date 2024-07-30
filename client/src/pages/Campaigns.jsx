import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { campaignsAPI } from "../API";
import { ContextStore } from "../context/context";
import DeleteModel from "../Components/DeleteModel";
import FloatNotification from "../Components/FloatNotification";
import Pagination from "../Components/Pagination";
import orgTypes from "../constants/orgTypes";
import LoadingSpinner from "../Components/LoadingSpinner";

const Campaigns = () => {
  const navigate = useNavigate();
  const { onboardingData } = ContextStore();
  const [campaignsData, setCampaignsData] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [campaignsId, setCampaignsId] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [showNotification, setShowNotification] = useState({
    show: false,
    status: "",
    title: "",
    message: <></>,
  });
  const [deleteModel, setDeleteModel] = useState(false);
  let ignore = false;
  const getCampaigns = async () => {
    const token = localStorage.getItem("bot_customer_token");
    await fetch(campaignsAPI, {
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
          setCampaignsData(data?.data);
          setCount(data.counts);
          setPageCount(data.page);
          setLoaded(true);
        }
      });
  };
  const deleteCampaigns = () => {
    const token = localStorage.getItem("bot_customer_token");
    if (token) {
      fetch(`${campaignsAPI}/delete `, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          _id: campaignsId,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            getCampaigns();
            setDeleteModel(false);
          } else {
            setShowNotification({
              show: true,
              message: <div>{data.error}</div>,
              title: "Error deleting campaign",
              status: "failed",
            });
          }
        });
    }
  };
  useEffect(() => {
    if (!ignore && onboardingData?._id) {
      if (onboardingData?.type !== orgTypes.NGO) {
        navigate('/');
        return;
      }
      getCampaigns();
    }

    return () => {
      ignore = true;
    };
  }, [onboardingData, page]);

  return (
    <div>
      <div className="flex justify-between items-start">
        <div className="text-xl font-bold">Campaigns</div>
        <div
          onClick={() => {
            navigate("/campaigns/add-campaigns");
          }}
          className="text-l border-2 rounded-lg px-6 py-1.5 border-purple-500 font-semibold transition-all duration-300 hover:text-white hover:bg-purple-500 text-purple-500 cursor-pointer flex gap-2 items-center"
        >
          Add Campaign
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
                      target quantity
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      donation url
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {campaignsData.length > 0 ? (
                    campaignsData.map((campaign, index) => (
                      <tr key={index}>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <div className="flex items-center">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {campaign?.name}
                            </p>
                          </div>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 line-clamp-2 whitespace-no-wrap">
                            {campaign?.description}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {campaign?.category}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {campaign?.targetQuantity}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 line-clamp-2 whitespace-no-wrap">
                            {campaign?.donationUrl}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white">
                          <div className="flex gap-2">
                            <div className="cursor-pointer">
                              <PencilIcon
                                onClick={() => {
                                  navigate(
                                    `/campaigns/edit-campaigns?id=${campaign?._id}`
                                  );
                                }}
                                className="h-5 w-5 text-blue-500"
                              />
                            </div>
                            <div className="cursor-pointer">
                              <TrashIcon
                                onClick={() => {
                                  setDeleteModel(true);
                                  setCampaignsId(campaign?._id);
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
                          {loaded ? "No campaigns found." : <LoadingSpinner />}
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
                data={campaignsData}
              />
            </div>
          </div>
        </div>
      </div>
      <DeleteModel
        handleDelete={deleteCampaigns}
        setShowModal={setDeleteModel}
        title={"campaign"}
        showModal={deleteModel}
      />
      <FloatNotification
        setShowNotification={setShowNotification}
        showNotification={showNotification}
      />
    </div>
  );
};

export default Campaigns;
