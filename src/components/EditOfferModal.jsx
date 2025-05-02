import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { createPortal } from "react-dom";

const EditOfferModal = ({ isOpen, onClose, onSubmit, offer }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: offer,
  });

  useEffect(() => {
    if (offer) {
      reset({
        title: offer.title,
        description: offer.description,
        discount: offer.discount,
        shopId: offer.shopId,
        validFrom: new Date(offer.validFrom.seconds * 1000)
          .toISOString()
          .split("T")[0],
        validTo: new Date(offer.validTo.seconds * 1000)
          .toISOString()
          .split("T")[0],
      });
    }
  }, [offer, reset]);

  const submit = async (data) => {
    if (!offer) return;

    const { title, description, discount, shopId, validFrom, validTo } = data;

    if (new Date(validTo) < new Date(validFrom)) {
      return alert("Valid To date must be after Valid From date");
    }

    const now = new Date();
    let status = "upcoming";
    if (now >= new Date(validFrom) && now <= new Date(validTo)) {
      status = "active";
    } else if (now > new Date(validTo)) {
      status = "expired";
    }

    const updatedOffer = {
      title,
      description,
      discount: Number(discount),
      shopId,
      validFrom: new Date(validFrom),
      validTo: new Date(validTo),
      status,
    };

    onSubmit(offer.id, updatedOffer);
    onClose();
  };

  if (!isOpen || !offer) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold">Edit Offer</h2>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          {/* Title */}
          <div>
            <input
              placeholder="Title"
              {...register("title", { required: "Title is required" })}
              className="w-full rounded border px-3 py-2"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <input
              placeholder="Description"
              {...register("description", {
                required: "Description is required",
              })}
              className="w-full rounded border px-3 py-2"
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Discount */}
          <div>
            <input
              type="number"
              placeholder="Discount (%)"
              {...register("discount", {
                required: "Discount is required",
                min: { value: 1, message: "Min 1%" },
                max: { value: 100, message: "Max 100%" },
              })}
              className="w-full rounded border px-3 py-2"
            />
            {errors.discount && (
              <p className="text-sm text-red-500">{errors.discount.message}</p>
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
              <p className="text-sm text-red-500">{errors.shopId.message}</p>
            )}
          </div>

          {/* Valid From */}
          <div>
            <label className="text-sm">Valid From</label>
            <input
              type="date"
              {...register("validFrom", {
                required: "Valid From date is required",
              })}
              className="w-full rounded border px-3 py-2"
            />
            {errors.validFrom && (
              <p className="text-sm text-red-500">{errors.validFrom.message}</p>
            )}
          </div>

          {/* Valid To */}
          <div>
            <label className="text-sm">Valid To</label>
            <input
              type="date"
              {...register("validTo", {
                required: "Valid To date is required",
              })}
              className="w-full rounded border px-3 py-2"
            />
            {errors.validTo && (
              <p className="text-sm text-red-500">{errors.validTo.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer text-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded bg-black px-4 py-2 text-white"
            >
              Update Offer
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById("modal-root"),
  );
};

export default EditOfferModal;
