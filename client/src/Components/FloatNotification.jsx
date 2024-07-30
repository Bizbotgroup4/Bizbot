import React, { useEffect } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Transition } from "@headlessui/react";

const FloatNotification = ({ showNotification, setShowNotification }) => {
  useEffect(() => {
    setTimeout(() => {
      setShowNotification({
        show: false,
        status: "",
        message: <></>,
      });
    }, 20000);
  }, [showNotification]);

  return (
    <Transition
      className="fixed right-5 top-5 space-y-4 w-1/2 sm:w-2/4 md:w-2/5 lg:w-1/3 shadow-xl rounded-xl"
      show={showNotification.show}
      enter="transition-all ease-in-out duration-500 delay-[200ms]"
      enterFrom="opacity-0 translate-x-6"
      enterTo="opacity-100 translate-x-0"
      leave="transition-all ease-in-out duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className=" flex flex-col justify-center">
        <div className="rounded-xl bg-gray-50 p-4 text-gray-500">
          <div className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <div
                className={`inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                  showNotification.status === "success"
                    ? "bg-green-100 text-green-500"
                    : "bg-red-100 text-red-500"
                }`}
              >
                {showNotification.status === "success" ? (
                  <CheckCircleIcon className="h-5 w-5" />
                ) : (
                  <XCircleIcon className="h-5 w-5" />
                )}
              </div>
              <div className="ml-3 text-[16px] font-semibold">
                {showNotification.title}
              </div>
            </div>
            <button
              type="button"
              className="inline-flex h-8 w-8 rounded-lg bg-gray-50 p-1.5 text-gray-400 hover:bg-gray-100 hover:text-orange-500 focus:ring-2 focus:ring-gray-300 "
              onClick={() => {
                setShowNotification({
                  show: false,
                  status: "",
                  message: <></>,
                });
              }}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-2">{showNotification.message}</div>
        </div>
      </div>
    </Transition>
  );
};

export default FloatNotification;
