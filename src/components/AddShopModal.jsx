import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";

const AddShopModal = ({ isOpen, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const submit = (data) => {
    onSubmit(data);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[90%] max-w-lg rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Add New Shop</h2>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          {/* Shop Name */}
          <div>
            <input
              placeholder="Shop Name"
              {...register("shopName", { required: "Shop name is required" })}
              className="w-full rounded border px-3 py-2"
            />
            {errors.shopName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.shopName.message}
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

          {/* Floor */}
          <div>
            <input
              placeholder="Floor (e.g. 1st)"
              {...register("floor", {
                required: "Floor is required",
                pattern: {
                  value: /^[1-4](st|nd|rd|th)$/,
                  message: "Floor must be in format like 1st, 2nd etc.",
                },
              })}
              className="w-full rounded border px-3 py-2"
            />
            {errors.floor && (
              <p className="mt-1 text-sm text-red-500">
                {errors.floor.message}
              </p>
            )}
          </div>

          {/* Contact */}
          <div>
            <input
              placeholder="Contact"
              {...register("contact", {
                required: "Contact is required",
                pattern: {
                  value: /^\+91\s?\d{10}$/,
                  message: "Use valid +91 format (e.g. +91 9876543210)",
                },
              })}
              className="w-full rounded border px-3 py-2"
            />
            {errors.contact && (
              <p className="mt-1 text-sm text-red-500">
                {errors.contact.message}
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

          {/* Actions */}
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="cursor-pointer rounded border border-gray-600 px-4 py-2 text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded bg-black px-4 py-2 text-white hover:bg-slate-900"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById("modal-root"),
  );
};

export default AddShopModal;
