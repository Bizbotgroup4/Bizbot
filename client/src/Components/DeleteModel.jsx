import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function DeleteModel({
  showModal,
  setShowModal,
  title,
  handleDelete,
}) {
  return (
    <Transition appear show={showModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[100]"
        onClose={() => setShowModal(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="flex items-center px-4 py-16">
                <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
                  <div className="sm:flex flex-col gap-2">
                    <div className="flex">
                      <div className="flex items-center justify-center flex-none w-12 h-12 mx-auto bg-purple-100 rounded-full">
                        <ExclamationTriangleIcon className="h-6 w-6 text-purple-500" />
                      </div>
                      <div className="mt-2 text-center sm:ml-4 sm:text-left">
                        <h4 className="text-lg capitalize font-medium text-gray-800">
                          Delete {title}
                        </h4>
                        <p className="text-md leading-relaxed text-gray-500">
                          Are you sure you want to delete this {title}?
                          This action is irreversible and will permanently remove the {title} from the platform.
                        </p>
                      </div>
                    </div>
                    <div className="items-center gap-2 mt-3 sm:flex">
                      <button
                        className="w-full mt-2 p-2 flex-1 text-white bg-purple-500 rounded-md border-2 border-purple-500 outline-none ring-offset-2 ring-purple-500 focus:ring-2"
                        onClick={handleDelete}
                      >
                        Delete
                      </button>
                      <button
                        className="w-full mt-2 p-2 flex-1 rounded-md outline-none border-2 text-purple-500 border-purple-500 ring-offset-2 ring-purple-500 focus:ring-2"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
