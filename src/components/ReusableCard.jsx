import React from "react";

// eslint-disable-next-line no-unused-vars
export default function ReusableCard({ Icon1, Icon2, count, label }) {
  return (
    <div className="flex h-full max-h-[165px] w-[136px] max-w-[165px] min-w-[136px] flex-1 flex-col gap-y-2 rounded-2xl border border-[#C1C0C0] bg-[#E8E8E8] p-4 md:w-[165px]">
      <div className="flex items-center justify-between">
        <Icon1 className="text-4xl text-neutral-800 md:text-[2.5rem]" />
        <Icon2 className="cursor-pointer text-2xl text-neutral-800 hover:scale-110" />
      </div>
      <span className="text-3xl font-bold text-neutral-700 md:text-4xl">
        {count}
      </span>
      <span className="text-base font-semibold text-neutral-500 md:text-lg">
        {label}
      </span>
    </div>
  );
}
