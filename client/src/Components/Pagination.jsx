import React from "react";

const Pagination = ({ count, page, pageCount, setPage, data }) => {
  return (
    <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
      <span className="text-xs xs:text-sm text-gray-900">
        Showing {page * 10 - 9} to {page * 10 + (data.length - 10)} of{" "}
        {pageCount} Page Entries
      </span>
      <div className="inline-flex mt-2 xs:mt-0">
        <button
          onClick={() => {
            setPage(page - 1);
          }}
          disabled={page <= 1}
          className="text-sm text-purple-50 transition cursor-pointer duration-150 hover:bg-purple-600 bg-purple-500 font-semibold py-2 px-4 rounded-l"
        >
          Prev
        </button>
        &nbsp; &nbsp;
        <button
          onClick={() => {
            setPage(page + 1);
          }}
          disabled={page >= pageCount}
          className="text-sm text-purple-50 transition cursor-pointer duration-150 hover:bg-purple-600 bg-purple-500 font-semibold py-2 px-4 rounded-r"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
