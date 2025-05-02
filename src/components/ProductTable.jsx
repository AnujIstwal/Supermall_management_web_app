import React, { useState } from "react";
import useProducts from "../hooks/products/useProducts";
import { LuPencil } from "react-icons/lu";
import { FaRegTrashCan, FaTrash } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import ConfirmModal from "./ConfirmModal";
import useDeleteProduct from "../hooks/products/useDeleteProduct";
import useUpdateProduct from "../hooks/products/useUpdateProduct";
import EditProductModal from "./EditProductModal";
import toast from "react-hot-toast";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import TableSkeletonUI from "./TableSkeletonUI";

const PRODUCTS_PER_PAGE = 8;

export default function ProductTable({
  searchText,
  sortOrder,
  sortField,
  statusFilter,
  categoryFilter,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [isMultipleDeleteModalOpen, setIsMultipleDeleteModalOpen] =
    useState(false);

  //checkbox state
  const [selectedProducts, setSelectedProducts] = useState([]);

  // custom hooks
  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useProducts({ sortField, sortOrder });
  const deleteProductMutation = useDeleteProduct();
  const { mutate } = useUpdateProduct();

  let filteredProducts = searchText
    ? products.filter((product) =>
        product.productName?.toLowerCase().includes(searchText.toLowerCase()),
      )
    : products;

  filteredProducts = filteredProducts
    .filter((product) =>
      statusFilter ? product.status === statusFilter : true,
    )
    .filter((product) =>
      categoryFilter ? product.category === categoryFilter : true,
    );

  // Pagination Logic
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts?.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE,
  );

  const start = (currentPage - 1) * PRODUCTS_PER_PAGE + 1;
  const end = Math.min(currentPage * PRODUCTS_PER_PAGE, products.length);

  const handleSelect = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };
  const handleSelectAll = (products) => {
    const allIds = products.map((product) => product.id);
    setSelectedProducts((prev) =>
      prev.length === allIds.length ? [] : allIds,
    );
  };

  const handleBulkDelete = async () => {
    let loadingId = toast.loading("Deleting products...", {
      position: "bottom-center",
    });
    try {
      await Promise.all(
        selectedProducts.map((productId) =>
          deleteDoc(doc(db, "products", productId)),
        ),
      );
      toast.success("Selected products deleted!", {
        id: loadingId,
        position: "bottom-center",
      });
      setIsMultipleDeleteModalOpen(false);
      setSelectedProducts([]);
      refetch(); // if you're using react-query or re-fetch logic
    } catch (error) {
      toast.error("Error deleting products", {
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
          "Product",
          "Category",
          "Price (₹)",
          "Shop Id",
          "Stock",
          "Status",
          "Actions",
        ]}
      />
    );
  if (isError) return <p>Error loading products</p>;

  return (
    <div className="flex h-full w-full flex-col justify-between gap-y-2">
      <div className="overflow-hidden rounded-t-4xl px-4 py-1">
        <table className="hidden min-w-full table-auto text-left text-[.9rem] md:table">
          <thead className="text-neutral-600">
            <tr className="border-b border-gray-400">
              <th className="py-3 pl-2">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === currentProducts.length}
                  onChange={() => handleSelectAll(currentProducts)}
                  className="h-[1.1rem] w-[1.1rem] accent-purple-600"
                />
              </th>

              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price (₹)</th>
              <th className="px-4 py-3">Shop ID</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {currentProducts?.map((product, index) => (
              <tr
                key={product.id}
                className={`border-t border-gray-200 ${index % 2 === 0 ? "bg-zinc-100" : ""}`}
              >
                <td className="py-3 pl-2">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelect(product.id)}
                    className="h-[1.1rem] w-[1.1rem] accent-purple-600"
                  />
                </td>
                <td className="px-4 py-3 font-semibold text-zinc-700">
                  {product.productName}
                </td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3 font-bold text-green-600">
                  ₹ {product.price.toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-3">{product.shopId}</td>
                <td className="px-4 py-3">
                  <span
                    className={`font-bold ${product.stock > 20 ? "text-lime-600" : "text-red-600"}`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-sm font-semibold ${
                      product.status === "active"
                        ? "border border-purple-300 bg-purple-100 text-purple-700"
                        : "border border-rose-300 bg-rose-100 text-rose-600"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="flex items-center justify-center space-x-4 px-4 py-3">
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsEditModalOpen(true);
                    }}
                    className="cursor-pointer"
                  >
                    <LuPencil
                      size={18}
                      className="text-gray-500 hover:text-blue-500"
                    />
                  </button>
                  <button
                    onClick={() => {
                      setProductToDelete(product);
                      setIsDeleteModalOpen(true);
                    }}
                    className="cursor-pointer"
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
          {currentProducts?.map((product) => (
            <div
              key={product.id}
              className="my-2 flex w-full flex-col items-center justify-between gap-y-4 rounded-xl border border-[#D2C3C3] bg-[#F4F4F4] px-4 py-3"
            >
              <div className="flex w-full items-center gap-x-3">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => handleSelect(product.id)}
                  className="h-[1rem] w-[1rem] accent-purple-600"
                />
                <span className="font-semibold text-zinc-800">
                  {product.productName}
                </span>
              </div>

              <div className="flex w-full items-center justify-between">
                <span className="text-lg font-bold text-green-600">
                  ₹ {product.price.toLocaleString("en-IN")}
                </span>
                <span
                  className={`rounded-full px-1 text-sm ${
                    product.status === "active"
                      ? "border border-purple-300 bg-purple-100 text-purple-700"
                      : "border border-rose-300 bg-rose-100 text-rose-600"
                  }`}
                >
                  {product.status}
                </span>
              </div>

              <div className="flex w-full items-center justify-between">
                <p className="text-sm text-gray-500">
                  Category:{" "}
                  <span className="font-semibold">{product.category}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Stock: <span className="font-semibold">{product.stock}</span>
                </p>
              </div>

              <div className="flex items-center justify-center space-x-4 px-4 py-3">
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsEditModalOpen(true);
                  }}
                  className="cursor-pointer"
                >
                  <LuPencil
                    size={18}
                    className="text-gray-500 hover:text-blue-500"
                  />
                </button>
                <button
                  onClick={() => {
                    setProductToDelete(product);
                    setIsDeleteModalOpen(true);
                  }}
                  className="cursor-pointer"
                >
                  <FaRegTrashCan
                    size={18}
                    className="text-gray-500 hover:text-red-500"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedProducts.length > 0 && (
          <div className="fixed bottom-4 left-[50%] z-50 -translate-x-[50%]">
            <button
              onClick={() => {
                setIsMultipleDeleteModalOpen(true);
              }}
              className="flex items-center justify-center rounded-lg bg-red-500 px-4 py-2 font-semibold text-white shadow-lg hover:bg-red-700"
            >
              <FaTrash className="mr-2 text-lg" />
              Delete All ({selectedProducts?.length})
            </button>
          </div>
        )}

        <ConfirmModal
          isOpen={isDeleteModalOpen}
          title="Delete Product"
          message={`Are you sure you want to delete "${productToDelete?.productName}"?`}
          confirmText="Delete"
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={() => {
            deleteProductMutation.mutate(productToDelete.id, {
              onSuccess: () => {
                setIsDeleteModalOpen(false);
              },
            });
          }}
          loading={deleteProductMutation.isLoading}
        />

        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          product={selectedProduct}
          onSubmit={(id, data) => {
            mutate({ id, data });
          }}
        />
        {/* Bulk delete */}
        <ConfirmModal
          isOpen={isMultipleDeleteModalOpen}
          title="Delete Products"
          message={`Are you sure you want to delete "${selectedProducts?.length}" products? This action cannot be undone.`}
          confirmText="Delete All"
          onCancel={() => setIsMultipleDeleteModalOpen(false)}
          onConfirm={handleBulkDelete}
        />
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
          <span className="font-medium"> {products.length}</span> results
        </p>
      </div>
    </div>
  );
}
