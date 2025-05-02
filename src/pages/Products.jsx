import React, { useState } from "react";
import { IoFilter } from "react-icons/io5";
import { GoSortAsc } from "react-icons/go";
import { IoIosAdd } from "react-icons/io";
import { HiMagnifyingGlass } from "react-icons/hi2";
import ProductTable from "../components/ProductTable";
import AddProductModal from "../components/AddProductModal";
import useAddProduct from "../hooks/products/useAddProduct";

export default function Products() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [sortOrder, setSortOrder] = useState("asc"); // or "desc"
  const sortField = "productName"; // default sort by name

  //custom hooks
  const { mutate } = useAddProduct();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {/* header */}
      <div className="flex w-full flex-wrap items-center justify-between gap-y-2 px-6 py-4">
        {/* title */}
        <div className="flex items-center justify-center gap-x-4">
          <h2 className="text-2xl font-semibold">Products</h2>
        </div>

        {/* bttn grp */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center">
              <HiMagnifyingGlass className="text-2xl text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Search shops..."
              className="rounded-full border border-gray-400 bg-neutral-100 px-6 py-2 pl-12 text-sm text-gray-700 focus:ring-1 focus:ring-black focus:outline-none"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex cursor-pointer items-center justify-center gap-x-1 rounded-full border border-neutral-950 bg-neutral-100 px-4 py-1 text-[.92rem] text-black"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="flex cursor-pointer items-center justify-center gap-x-1 rounded-full border border-neutral-950 bg-neutral-100 px-4 py-1 text-[.92rem] text-black"
            >
              <option value="">All Categories</option>
              <option value="Sports">Sports</option>
              <option value="Fashion">Fashion</option>
              <option value="Electronics">Electronics</option>
              <option value="Toys">Toys</option>
              <option value="Books">Books</option>
              <option value="Food">Food</option>
              <option value="Clothing">Clothing</option>
            </select>
          </div>
          <button
            type="button"
            className="flex cursor-pointer items-center justify-center gap-x-1 rounded-full border border-neutral-950 bg-neutral-100 px-4 py-1 text-[.92rem] text-black"
            onClick={() => {
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
            }}
          >
            <GoSortAsc className="text-2xl" />
            <span className="text-[.92rem]">Sort</span>
          </button>
          <button
            type="button"
            className="flex cursor-pointer items-center justify-center gap-1 rounded-lg bg-neutral-900 px-4 py-1 text-[.92rem] text-white"
            onClick={() => setShowAddModal(true)}
          >
            <IoIosAdd className="text-2xl text-white" />
            Add new product
          </button>

          <AddProductModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSubmit={(newProduct) => {
              // call mutation here or push into local list
              mutate(newProduct);
            }}
          />
        </div>
      </div>

      {/* content */}
      <div className="h-full w-full flex-1 rounded-4xl border border-[#E3E3E3] bg-[#F8F8F8] shadow-xl drop-shadow-2xl">
        <ProductTable
          searchText={searchText}
          statusFilter={statusFilter}
          categoryFilter={categoryFilter}
          sortField={sortField}
          sortOrder={sortOrder}
        />
      </div>
    </div>
  );
}
