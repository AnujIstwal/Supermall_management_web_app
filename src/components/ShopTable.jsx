import React, { useState } from "react";
import useShops from "../hooks/useShops";
import { LuPencil } from "react-icons/lu";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { FaTrash } from "react-icons/fa";
import useDeleteShop from "../hooks/useDeleteShop";
import ConfirmModal from "./ConfirmModal";
import useUpdateShop from "../hooks/useUpdateShop";
import EditShopModal from "./EditShopModal";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import TableSkeletonUI from "./TableSkeletonUI";

const SHOPS_PER_PAGE = 8;

export default function ShopTable({
  statusFilter,
  floorFilter,
  sortField,
  sortOrder,
  searchText,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMultipleDeleteModalOpen, setIsMultipleDeleteModalOpen] =
    useState(false);
  const [shopToDelete, setShopToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);

  //checkbox state
  const [selectedShops, setSelectedShops] = useState([]);

  // custom hooks
  const {
    data: shops = [],
    refetch,
    isLoading,
    isError,
  } = useShops({ sortField, sortOrder });

  let filteredShops = searchText
    ? shops.filter((shop) =>
        shop.shopName?.toLowerCase().includes(searchText.toLowerCase()),
      )
    : shops;

  filteredShops = filteredShops
    .filter((shop) => (statusFilter ? shop.status === statusFilter : true))
    .filter((shop) => (floorFilter ? shop.floor === floorFilter : true));

  const deleteShopMutation = useDeleteShop();
  const { mutate } = useUpdateShop();

  // Pagination Logic
  const totalPages = Math.ceil(shops.length / SHOPS_PER_PAGE);
  const startIndex = (currentPage - 1) * SHOPS_PER_PAGE;
  const currentShops = filteredShops?.slice(
    startIndex,
    startIndex + SHOPS_PER_PAGE,
  );

  const start = (currentPage - 1) * SHOPS_PER_PAGE + 1;
  const end = Math.min(currentPage * SHOPS_PER_PAGE, shops.length);

  const handleSelect = (shopId) => {
    setSelectedShops((prev) =>
      prev.includes(shopId)
        ? prev.filter((id) => id !== shopId)
        : [...prev, shopId],
    );
  };
  const handleSelectAll = (shops) => {
    const allIds = shops.map((shop) => shop.id);
    setSelectedShops((prev) => (prev.length === allIds.length ? [] : allIds));
  };

  const handleBulkDelete = async () => {
    let loadingId = toast.loading("Deleting shops...");
    try {
      await Promise.all(
        selectedShops.map((shopId) => deleteDoc(doc(db, "shops", shopId))),
      );
      toast.success("Selected shops deleted!", {
        id: loadingId,
        position: "bottom-center",
      });
      setIsMultipleDeleteModalOpen(false);
      setSelectedShops([]);
      refetch(); // if you're using react-query or re-fetch logic
    } catch (error) {
      toast.error("Error deleting shops", {
        id: loadingId,
        position: "bottom-center",
      });
      console.error(error);
    }
  };

  if (isLoading)
    return (
      <TableSkeletonUI
        fields={[
          "Shop Id",
          "Shop Name",
          "Category",
          "Floor",
          "Contact",
          "Status",
          "Actions",
        ]}
      />
    );
  if (isError) return <p>Error loading shops</p>;

  return (
    <div className="flex h-full w-full flex-col justify-between gap-y-2">
      <div className="overflow-hidden rounded-t-4xl px-4 py-1">
        <table className="hidden min-w-full table-auto text-left text-[.9rem] md:table">
          <thead className="text-neutral-600">
            <tr className="border-b border-gray-400">
              <th className="py-3 pl-2">
                <input
                  type="checkbox"
                  checked={selectedShops.length === currentShops.length}
                  onChange={() => handleSelectAll(currentShops)}
                  className="h-[1.1rem] w-[1.1rem] accent-purple-600"
                />
              </th>
              <th className="px-4 py-3">Shop ID</th>
              <th className="px-4 py-3">Shop Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Floor</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {currentShops?.map((shop, index) => (
              <tr
                key={shop.id}
                className={`border-t border-gray-200 ${index % 2 === 0 ? "bg-zinc-100" : ""}`}
              >
                <td className="py-3 pl-2">
                  <input
                    type="checkbox"
                    checked={selectedShops.includes(shop.id)}
                    onChange={() => handleSelect(shop.id)}
                    className="h-[1.1rem] w-[1.1rem] accent-purple-600"
                  />
                </td>
                <td className="px-4 py-3">{shop.shopId}</td>
                <td className="px-4 py-3 font-semibold text-zinc-600">
                  {shop.shopName}
                </td>
                <td className="px-4 py-3">{shop.category}</td>
                <td className="px-4 py-3">{shop.floor}</td>
                <td className="px-4 py-3">{shop.contact}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-sm font-semibold ${
                      shop.status === "active"
                        ? "border border-purple-300 bg-purple-100 text-purple-700"
                        : "border border-rose-300 bg-rose-100 text-rose-600"
                    }`}
                  >
                    {shop.status}
                  </span>
                </td>
                <td className="flex items-center justify-center space-x-4 px-4 py-3">
                  <button
                    onClick={() => {
                      setSelectedShop(shop);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <LuPencil
                      size={18}
                      className="text-gray-500 hover:text-blue-500"
                    />
                  </button>
                  <button
                    onClick={() => {
                      setShopToDelete(shop);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <FaRegTrashCan
                      size={18}
                      className="text-gray-500 hover:text-red-500"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile view */}
        <div className="md:hidden">
          {currentShops?.map((shop) => (
            <div
              key={shop.id}
              className="my-2 flex w-full flex-col items-center justify-between gap-y-4 rounded-xl border border-[#D2C3C3] bg-[#F4F4F4] px-4 py-3"
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-x-3">
                  <input
                    type="checkbox"
                    checked={selectedShops.includes(shop.id)}
                    onChange={() => handleSelect(shop.id)}
                    className="h-[1rem] w-[1rem] accent-purple-600"
                  />
                  <span className="font-semibold text-zinc-800">
                    {shop.shopId}
                  </span>
                  <span
                    className={`rounded-full px-1 text-sm ${
                      shop.status === "active"
                        ? "border border-purple-300 bg-purple-100 text-purple-700"
                        : "border border-rose-300 bg-rose-100 text-rose-600"
                    }`}
                  >
                    {shop.status}
                  </span>
                </div>
                <div className="flex items-center gap-x-4">
                  <button
                    onClick={() => {
                      setSelectedShop(shop);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <LuPencil
                      size={18}
                      className="text-gray-500 hover:text-blue-500"
                    />
                  </button>
                  <button
                    onClick={() => {
                      setShopToDelete(shop);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <FaRegTrashCan
                      size={18}
                      className="text-gray-500 hover:text-red-500"
                    />
                  </button>
                </div>
              </div>

              <div className="flex w-full items-center justify-between">
                <h1 className="text-lg font-bold text-gray-600">
                  {shop.shopName}
                </h1>
              </div>

              <div className="flex w-full items-center justify-between">
                <p className="text-sm text-gray-500">
                  Category:{" "}
                  <span className="font-semibold">{shop.category}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Floor: <span className="font-semibold">{shop.floor}</span>
                </p>
              </div>

              <div className="flex w-full items-center justify-start gap-x-2">
                <p className="text-sm text-gray-400">{shop.contact}</p>
              </div>
            </div>
          ))}
        </div>

        {selectedShops.length > 0 && (
          <div className="fixed bottom-4 left-[50%] z-50 -translate-x-[50%]">
            <button
              onClick={() => {
                setIsMultipleDeleteModalOpen(true);
              }}
              className="flex items-center justify-center rounded-lg bg-red-500 px-4 py-2 font-semibold text-white shadow-lg hover:bg-red-700"
            >
              <FaTrash className="mr-2 text-lg" />
              Delete All ({selectedShops.length})
            </button>
          </div>
        )}
      </div>

      {/* Bulk delete */}
      <ConfirmModal
        isOpen={isMultipleDeleteModalOpen}
        title="Delete Shops"
        message={`Are you sure you want to delete "${selectedShops?.length}" shops? This action cannot be undone.`}
        confirmText="Delete All"
        onCancel={() => setIsMultipleDeleteModalOpen(false)}
        onConfirm={handleBulkDelete}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Shop"
        message={`Are you sure you want to delete "${shopToDelete?.shopName}"?`}
        confirmText="Delete"
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          deleteShopMutation.mutate(shopToDelete.id, {
            onSuccess: () => {
              setIsDeleteModalOpen(false);
            },
          });
        }}
        loading={deleteShopMutation.isLoading}
      />

      <EditShopModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        shop={selectedShop}
        onSubmit={(id, data) => {
          mutate({ id, data });
        }}
      />

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
          <span className="font-medium"> {shops.length}</span> results
        </p>
      </div>
    </div>
  );
}
