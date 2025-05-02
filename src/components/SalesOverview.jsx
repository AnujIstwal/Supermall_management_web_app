import { formatCurrencyINR } from "../util/util";
import useSales from "../hooks/useSales";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import useWindowWidth from "../hooks/useWindowWidth";

// import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export default function SalesOverview({ data }) {
  const { data: salesData, isLoading } = useSales();
  const width = useWindowWidth();

  const barSize = width < 768 ? 12 : 25;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Sales overview</h2>

        <p className="text-[.9rem] text-zinc-500">
          Average sales from the past 7 days is{" "}
          <span className="font-medium text-black">
            {formatCurrencyINR(data?.averageSales)}
          </span>
        </p>
      </div>

      {/* Stats */}
      <div className="mb-4 flex flex-col items-center justify-between gap-4 md:flex-row">
        <h1 className="text-2xl font-bold text-black">
          {formatCurrencyINR(data?.totalSales)}
        </h1>
        <div className="flex items-center gap-4 text-[.9rem]">
          <div className="flex items-center gap-1">
            <span className="text-gray-600">Sales</span>
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-600">
              +0.8%
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-600">Customer</span>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600">
              7,897
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salesData}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF005C" stopOpacity={1} />
                <stop offset="100%" stopColor="#FF7DA0" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="sales"
              fill="url(#barGradient)"
              radius={[99, 99, 0, 0]}
              barSize={barSize}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
