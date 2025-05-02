import React from "react";
import {
  SiApple,
  SiNike,
  SiPuma,
  SiAdidas,
  SiAcer,
  SiHp,
} from "react-icons/si";

export default function Brands() {
  return (
    <div className="flex h-full flex-col gap-y-6 rounded-4xl bg-[#F8F8F8] px-6 py-4 drop-shadow-lg">
      <h1 className="text-center text-lg font-semibold text-neutral-800">
        Top Brands
      </h1>

      <div className="flex flex-col items-center justify-center gap-y-4">
        <div className="flex items-center justify-center gap-x-4">
          <SiNike className="text-3xl text-neutral-800" />
          <h1 className="min-w-[60px] text-neutral-800">Nike</h1>
        </div>

        <div className="flex items-center justify-center gap-x-4">
          <SiApple className="text-3xl text-neutral-800" />
          <h1 className="min-w-[60px] text-neutral-800">Apple</h1>
        </div>

        <div className="flex items-center justify-center gap-x-4">
          <SiPuma className="text-3xl text-neutral-800" />
          <h1 className="min-w-[60px] text-neutral-800">Puma</h1>
        </div>

        <div className="flex items-center justify-center gap-x-4">
          <SiHp className="text-3xl text-neutral-800" />
          <h1 className="min-w-[60px] text-neutral-800">H.P</h1>
        </div>

        <div className="flex items-center justify-center gap-x-4">
          <SiAdidas className="text-3xl text-neutral-800" />
          <h1 className="min-w-[60px] text-neutral-800">Adidas</h1>
        </div>

        <div className="flex items-center justify-center gap-x-4">
          <SiAcer className="text-3xl text-neutral-800" />
          <h1 className="min-w-[60px] text-neutral-800">Acer</h1>
        </div>
      </div>
    </div>
  );
}
