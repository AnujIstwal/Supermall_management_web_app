import { format } from "date-fns";
import React, { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const LOGS_PER_PAGE = 7;

export default function LogsTable({ logs }) {
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination Logic
  const totalPages = Math.ceil(logs?.length / LOGS_PER_PAGE);
  const startIndex = (currentPage - 1) * LOGS_PER_PAGE;
  const currentLogs = logs?.slice(startIndex, startIndex + LOGS_PER_PAGE);

  const start = (currentPage - 1) * LOGS_PER_PAGE + 1;
  const end = Math.min(currentPage * LOGS_PER_PAGE, logs?.length);

  return (
    <div className="flex h-full w-full flex-col justify-between gap-y-2">
      <div className="overflow-hidden rounded-t-4xl px-4 py-1">
        <table className="hidden min-w-full table-auto text-left text-sm md:table">
          <thead className="text-neutral-600">
            <tr className="border-b border-gray-400">
              <th className="p-4">Action</th>
              <th className="p-4">User</th>
              <th className="p-4">Time</th>
              <th className="p-4">Description</th>
              <th className="p-4">Ref ID</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {currentLogs.length > 0 ? (
              currentLogs.map((log, index) => (
                <tr
                  key={log.id}
                  className={`border-t border-gray-200 ${index % 2 === 0 ? "bg-zinc-100" : ""}`}
                >
                  <td className="p-4">
                    <span
                      className={`rounded-full ${log.action.split("_")[1] === "deleted" ? "bg-red-100" : log.action.split("_")[1] === "created" ? "bg-green-100" : "bg-yellow-100"} px-2 py-1 text-xs text-gray-800`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4">{log.user || "—"}</td>
                  <td className="p-4">
                    {log.timestamp
                      ? format(log.timestamp, "dd MMM yyyy, hh:mm a")
                      : "N/A"}
                  </td>
                  <td className="p-4">{log.description}</td>
                  <td className="p-4 text-xs text-gray-500">{log.refId}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan="5">
                  No logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden">
        <div className="flex flex-col gap-y-2 px-4">
          {currentLogs.length > 0 ? (
            currentLogs.map((log, index) => (
              <div
                key={log.id}
                className={`flex flex-col gap-y-1 rounded-xl border border-[#D2C3C3] bg-[#F4F4F4] p-4 ${
                  index % 2 === 0 ? "bg-zinc-100" : ""
                }`}
              >
                <span
                  className={`rounded-full ${log.action.split("_")[1] === "deleted" ? "bg-red-100" : log.action.split("_")[1] === "created" ? "bg-green-100" : "bg-yellow-100"} px-2 py-1 text-xs text-gray-800`}
                >
                  {log.action}
                </span>
                <p className="text-sm font-medium">{log.user || "—"}</p>
                <p className="text-xs text-gray-500">
                  {log.timestamp
                    ? format(log.timestamp, "dd MMM yyyy, hh:mm a")
                    : "N/A"}
                </p>
                <p className="text-sm">{log.description}</p>
                <p className="text-xs text-gray-500">{log.refId}</p>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center p-4">
              No logs found.
            </div>
          )}
        </div>
      </div>

      {/* Pagination Control */}
      <div className="flex items-center justify-between gap-x-2 rounded-b-4xl border-t border-zinc-300 bg-zinc-100 px-8 py-2 text-sm">
        <div className="flex items-center gap-x-4">
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center justify-center gap-1 rounded bg-gray-200 px-3 py-1 hover:bg-gray-300 disabled:opacity-50"
          >
            <IoIosArrowBack />
            Previous
          </button>

          <span className="text-sm font-medium text-zinc-800">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="flex items-center justify-center gap-1 rounded bg-gray-200 px-3 py-1 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
            <IoIosArrowForward />
          </button>
        </div>

        <p className="hidden text-zinc-700 md:block">
          Showing <span className="font-medium">{start}</span>–
          <span className="font-medium">{end}</span> of
          <span className="font-medium"> {logs.length}</span> results
        </p>
      </div>
    </div>
  );
}
