import { useForm } from "react-hook-form";
import { createPortal } from "react-dom";
import { useEffect } from "react";

export default function EditProductModal({
  isOpen,
  onClose,
  onSubmit,
  product,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: product,
  });

  useEffect(() => {
    reset(product);
  }, [product, reset]);

  if (!isOpen || !product) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Edit Product</h2>
        <form
          onSubmit={handleSubmit((data) => {
            onSubmit(product.id, data);
            onClose();
          })}
          className="space-y-4"
        >
          {/* Product Name */}
          <div>
            <input
              placeholder="Product Name"
              {...register("productName", {
                required: "Product name is required",
              })}
              className="w-full rounded border px-3 py-2"
            />
            {errors.productName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.productName.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <input
              placeholder="Price"
              type="number"
              {...register("price", {
                required: "Price is required",
                min: { value: 0, message: "Price must be non-negative" },
              })}
              className="w-full rounded border px-3 py-2"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-500">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <input
              placeholder="Category"
              {...register("category", { required: "Category is required" })}
              className="w-full rounded border px-3 py-2"
            />
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Shop ID */}
          <div>
            <input
              placeholder="Shop ID (e.g. SH001)"
              {...register("shopId", {
                required: "Shop ID is required",
                pattern: {
                  value: /^SH\d{3}$/,
                  message: "Format must be like SH001",
                },
              })}
              className="w-full rounded border px-3 py-2"
            />
            {errors.shopId && (
              <p className="mt-1 text-sm text-red-500">
                {errors.shopId.message}
              </p>
            )}
          </div>

          {/* Stock */}
          <div>
            <input
              placeholder="Stock"
              type="number"
              {...register("stock", {
                required: "Stock is required",
                min: { value: 0, message: "Stock must be non-negative" },
              })}
              className="w-full rounded border px-3 py-2"
            />
            {errors.stock && (
              <p className="mt-1 text-sm text-red-500">
                {errors.stock.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <select
              {...register("status", { required: "Status is required" })}
              className="w-full rounded border px-3 py-2"
            >
              <option value="">Select status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-500">
                {errors.status.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded border border-gray-400 px-4 py-2 text-gray-600 hover:bg-zinc-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded bg-black px-4 py-2 text-white hover:bg-neutral-800"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById("modal-root"),
  );
}
