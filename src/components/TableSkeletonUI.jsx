import React from "react";
import Skeleton from "react-loading-skeleton";

export default function TableSkeletonUI({ fields }) {
  return (
    <div className="overflow-hidden rounded-t-4xl px-4 py-1">
      <table className="min-w-full table-auto text-left text-[.9rem]">
        <thead className="text-neutral-600">
          <tr className="border-b border-gray-400">
            <th className="py-3 pl-2">
              <input
                type="checkbox"
                //
                className="h-[1.1rem] w-[1.1rem] accent-purple-600"
              />
            </th>
            {fields.map((field, index) => (
              <th className="px-4 py-3" key={index}>
                {field}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-800">
          {Array.from({ length: 10 }).map((_, index) => (
            <tr key={index}>
              <td className="py-3 pl-2">
                <Skeleton />
              </td>
              {fields.map((_, index) => (
                <td className="px-4 py-3" key={index}>
                  <Skeleton />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
