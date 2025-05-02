import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useSummary from "../hooks/useSummary";
import ShopSeeder from "../util/ShopSeeder";

import ReusableCard from "../components/ReusableCard";
import Brands from "../components/Brands";
import SalesOverview from "../components/SalesOverview";

// Icons
import { CiShop } from "react-icons/ci";
import { CiBoxList } from "react-icons/ci";
import { GoArrowRight } from "react-icons/go";
import { GoArrowUpRight } from "react-icons/go";
import { MdDiscount } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { data, isLoading } = useSummary();
  const formatter = Intl.NumberFormat("en", { notation: "compact" });

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {/* header */}
      <div className="flex w-full items-center justify-between py-2 md:px-6">
        {/* title */}
        <div className="flex items-center justify-center gap-x-4">
          <h2 className="text-2xl font-semibold md:text-3xl">
            Good morning,{" "}
            <span className="font-bold text-neutral-600">Admin</span>
          </h2>
          <span className="rounded-full border border-amber-600 bg-amber-100 px-2 text-sm text-amber-600">
            admin
          </span>
        </div>

        {/* bttn grp */}
        <div className="hidden items-center justify-center gap-x-4 md:flex">
          <Link
            to="/shops"
            className="flex cursor-pointer items-center justify-center gap-x-1 rounded-lg border border-neutral-950 px-4 py-1 text-black hover:bg-neutral-200"
          >
            <IoIosAdd className="text-2xl" />
            <span>shop</span>
          </Link>
          <Link
            to="/products"
            className="flex cursor-pointer items-center justify-center gap-x-1 rounded-lg border border-neutral-950 px-4 py-1 text-black hover:bg-neutral-200"
          >
            <IoIosAdd className="text-2xl" />
            <span>product</span>
          </Link>
          <Link
            to="/offers"
            className="cursor-pointer rounded-lg bg-neutral-900 px-4 py-1 text-white hover:bg-neutral-800"
          >
            Create new offer
          </Link>
        </div>
      </div>

      {/* content */}

      <div className="flex w-full flex-1 flex-col py-4 md:flex-row md:px-6">
        <div className="flex h-full w-full flex-1 flex-col">
          <div className="flex w-full basis-[35%] flex-wrap gap-4 py-2 md:px-4">
            {isLoading ? (
              <SkeletonTheme baseColor="#E4E4E4" highlightColor="#D3D3D3">
                <div className="flex h-full w-[165px] flex-col gap-y-2 rounded-2xl border border-[#C1C0C0] bg-[#E8E8E8] p-4">
                  <div className="flex items-center justify-between">
                    <Skeleton width={50} borderRadius={100} />
                  </div>
                  <Skeleton borderRadius={100} />
                  <Skeleton borderRadius={100} />
                  <Skeleton width={80} borderRadius={100} />
                </div>
              </SkeletonTheme>
            ) : (
              <ReusableCard
                Icon1={CiShop}
                Icon2={GoArrowRight}
                count={data[0]?.totalShops || 0}
                label="total shops"
              />
            )}

            {isLoading ? (
              <SkeletonTheme baseColor="#E4E4E4" highlightColor="#D3D3D3">
                <div className="flex h-full w-[165px] flex-col gap-y-2 rounded-2xl border border-[#C1C0C0] bg-[#E8E8E8] p-4">
                  <div className="flex items-center justify-between">
                    <Skeleton width={50} borderRadius={100} />
                  </div>
                  <Skeleton borderRadius={100} />
                  <Skeleton borderRadius={100} />
                  <Skeleton width={80} borderRadius={100} />
                </div>
              </SkeletonTheme>
            ) : (
              <ReusableCard
                Icon1={CiBoxList}
                Icon2={GoArrowRight}
                count={formatter.format(data[0]?.totalProducts) || 0}
                label="total products"
              />
            )}

            <div className="flex h-full max-h-[200px] flex-1 flex-col gap-y-2 rounded-2xl bg-gradient-to-br from-[#FFB7B7] to-[#D94646] p-4">
              <div className="flex items-center justify-between">
                <span className="text-xl font-semibold tracking-wider text-neutral-50 uppercase">
                  special offer
                </span>
                <span className="rounded-full bg-rose-300 p-2 transition-all hover:bg-rose-400">
                  <GoArrowUpRight className="text-2xl text-neutral-50" />
                </span>
              </div>
              <div className="flex items-center justify-start gap-x-4">
                <span className="text-4xl font-black text-neutral-50">
                  20% off
                </span>
                <MdDiscount className="text-2xl text-neutral-50" />
              </div>
              <span className="font-light text-neutral-50">
                {isLoading ? (
                  <SkeletonTheme baseColor="#FFB7B7" highlightColor="#D94646">
                    <Skeleton count={1} width={100} />
                  </SkeletonTheme>
                ) : (
                  "28 active offers"
                )}
              </span>
            </div>
          </div>
          <div className="w-full flex-1 py-2 md:px-4">
            <div className="h-full w-full rounded-3xl bg-[#F8F8F8] p-4 drop-shadow-lg md:rounded-4xl md:p-6">
              <SalesOverview data={data?.[0]} />
            </div>
          </div>
        </div>

        <div className="h-full px-4 py-2">
          <Brands />
        </div>
      </div>
    </div>
  );
}
