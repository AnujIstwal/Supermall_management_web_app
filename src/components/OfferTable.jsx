import React, { useState } from "react";
import useOffers from "../hooks/offers/useOffers";
import { format } from "date-fns";
import { LuPencil } from "react-icons/lu";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { FaTrash } from "react-icons/fa";
import useDeleteOffer from "../hooks/offers/useDeleteOffer";
import ConfirmModal from "./ConfirmModal";
import useUpdateOffer from "../hooks/offers/useUpdateOffer";
import EditOfferModal from "./EditOfferModal";

import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import toast from "react-hot-toast";
import TableSkeletonUI from "./TableSkeletonUI";

const OFFER_PER_PAGE = 6;

export default function OfferTable({
  searchText,
  statusFilter,
  sortField,
  sortOrder,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMultipleDeleteModalOpen, setIsMultipleDeleteModalOpen] =
    useState(false);
  const [offerToDelete, setOfferToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  //  checkbox state
  const [selectedOffers, setSelectedOffers] = useState([]);

  // custom hooks
  const {
    data: offers = [],
    refetch,
    isLoading,
    isError,
  } = useOffers({ sortField, sortOrder });

  let filteredOffers = searchText
    ? offers.filter((offer) =>
        offer.title?.toLowerCase().includes(searchText.toLowerCase()),
      )
    : offers;

  filteredOffers = filteredOffers?.filter((offer) =>
    statusFilter ? offer.status === statusFilter : true,
  );

  const deleteOfferMutation = useDeleteOffer();
  const { mutate } = useUpdateOffer();

  // Pagination Logic
  const totalPages = Math.ceil(offers.length / OFFER_PER_PAGE);
  const startIndex = (currentPage - 1) * OFFER_PER_PAGE;
  const currentOffers = filteredOffers?.slice(
    startIndex,
    startIndex + OFFER_PER_PAGE,
  );

  const start = (currentPage - 1) * OFFER_PER_PAGE + 1;
  const end = Math.min(currentPage * OFFER_PER_PAGE, offers.length);

  const handleSelect = (offerId) => {
    setSelectedOffers((prev) =>
      prev.includes(offerId)
        ? prev.filter((id) => id !== offerId)
        : [...prev, offerId],
    );
  };
  const handleSelectAll = (offers) => {
    const allIds = offers.map((offer) => offer.id);
    setSelectedOffers((prev) => (prev.length === allIds.length ? [] : allIds));
  };

  const handleBulkDelete = async () => {
    let loadingId = toast.loading("Deleting offers...");
    try {
      await Promise.all(
        selectedOffers.map((offerId) => deleteDoc(doc(db, "offers", offerId))),
      );
      toast.success("Selected offers deleted!", {
        id: loadingId,
        position: "bottom-center",
      });
      setIsMultipleDeleteModalOpen(false);
      setSelectedOffers([]);
      refetch(); // if you're using react-query or re-fetch logic
    } catch (error) {
      toast.error("Error deleting offers", {
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
          "Title",
          "Description",
          "Discount",
          "Shop",
          "Validity",
          "Status",
          "Actions",
        ]}
      />
    );
  if (isError) return <p>Error loading offers</p>;

  return (
    <div className="flex h-full w-full flex-col justify-between gap-y-2">
      <div className="overflow-hidden rounded-t-4xl px-4 py-1">
        <table className="hidden min-w-full table-auto text-left text-[.9rem] md:table">
          <thead className="text-neutral-600">
            <tr className="border-b border-gray-400">
              <th className="py-3 pl-2">
                <input
                  type="checkbox"
                  checked={selectedOffers.length === currentOffers.length}
                  onChange={() => handleSelectAll(currentOffers)}
                  className="h-[1.1rem] w-[1.1rem] accent-purple-600"
                />
              </th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Discount</th>
              <th className="px-4 py-3">Shop</th>
              <th className="px-4 py-3">Validity</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {currentOffers?.map((offer, index) => (
              <tr
                key={offer.id}
                className={`border-t border-gray-200 ${index % 2 === 0 ? "bg-zinc-100" : ""}`}
              >
                <td className="py-3 pl-2">
                  <input
                    type="checkbox"
                    checked={selectedOffers.includes(offer.id)}
                    onChange={() => handleSelect(offer.id)}
                    className="h-[1.1rem] w-[1.1rem] accent-purple-600"
                  />
                </td>
                <td className="px-4 py-3 font-semibold text-zinc-700">
                  {offer.title}
                </td>
                <td className="px-4 py-3 text-sm text-zinc-600">
                  {offer.description}
                </td>
                <td className="px-4 py-3 font-bold text-green-600">
                  {offer.discount}
                </td>
                <td className="px-4 py-3">{offer.shopId}</td>
                <td className="px-4 py-3">
                  {offer?.validFrom && offer?.validTo ? (
                    <>
                      {format(
                        offer.validFrom.seconds
                          ? new Date(offer.validFrom.seconds * 1000) // Firestore Timestamp
                          : new Date(offer.validFrom), // ISO String or normal JS Date
                        "dd MMM",
                      )}
                      {" - "}
                      {format(
                        offer.validTo.seconds
                          ? new Date(offer.validTo.seconds * 1000)
                          : new Date(offer.validTo),
                        "dd MMM",
                      )}
                    </>
                  ) : (
                    "—"
                  )}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-sm font-semibold ${
                      offer.status === "active"
                        ? "border border-purple-300 bg-purple-100 text-purple-700"
                        : offer.status === "expired"
                          ? "border border-rose-300 bg-rose-100 text-rose-600"
                          : "border border-amber-300 bg-amber-100 text-amber-600"
                    }`}
                  >
                    {offer.status}
                  </span>
                </td>

                <td className="flex items-center justify-center space-x-4 px-4 py-3">
                  <button
                    onClick={() => {
                      setSelectedOffer(offer);
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
                      setOfferToDelete(offer);
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

        {/* MObile view */}
        <div className="md:hidden">
          {currentOffers?.map((offer) => (
            <div
              key={offer.id}
              className="my-2 flex w-full flex-col items-center justify-between gap-y-4 rounded-xl border border-[#D2C3C3] bg-[#F4F4F4] px-4 py-3"
            >
              <div className="flex w-full items-center">
                <input
                  type="checkbox"
                  checked={selectedOffers.includes(offer.id)}
                  onChange={() => handleSelect(offer.id)}
                  className="h-[1.1rem] w-[1.1rem] accent-purple-600"
                />
                <p className="px-4 py-3 font-semibold text-zinc-700">
                  {offer.title}
                </p>
              </div>

              <div className="flex w-full items-center justify-between">
                <p className="text-sm text-zinc-600">
                  Discount:{" "}
                  <span className="font-bold text-green-600">
                    {offer.discount}%
                  </span>
                </p>

                <span
                  className={`rounded-full px-2 text-sm ${
                    offer.status === "active"
                      ? "border border-purple-300 bg-purple-100 text-purple-700"
                      : offer.status === "expired"
                        ? "border border-rose-300 bg-rose-100 text-rose-600"
                        : "border border-amber-300 bg-amber-100 text-amber-600"
                  }`}
                >
                  {offer.status}
                </span>
              </div>

              <div className="flex w-full items-center justify-between">
                <p className="text-sm text-zinc-600">
                  From:{" "}
                  {offer?.validFrom ? (
                    <>
                      {format(
                        offer.validFrom.seconds
                          ? new Date(offer.validFrom.seconds * 1000)
                          : new Date(offer.validFrom),
                        "dd MMM",
                      )}
                    </>
                  ) : (
                    "—"
                  )}
                </p>

                <p className="text-sm text-zinc-600">
                  To:{" "}
                  {offer?.validTo ? (
                    <>
                      {format(
                        offer.validTo.seconds
                          ? new Date(offer.validTo.seconds * 1000)
                          : new Date(offer.validTo),
                        "dd MMM",
                      )}
                    </>
                  ) : (
                    "—"
                  )}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    setSelectedOffer(offer);
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
                    setOfferToDelete(offer);
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
          ))}
        </div>

        {selectedOffers.length > 0 && (
          <div className="fixed bottom-4 left-[50%] z-50 -translate-x-[50%]">
            <button
              onClick={() => {
                setIsMultipleDeleteModalOpen(true);
              }}
              className="flex items-center justify-center rounded-lg bg-red-500 px-4 py-2 font-semibold text-white shadow-lg hover:bg-red-700"
            >
              <FaTrash className="mr-2 text-lg" />
              Delete All ({selectedOffers.length})
            </button>
          </div>
        )}
      </div>

      {/* Bulk delete */}
      <ConfirmModal
        isOpen={isMultipleDeleteModalOpen}
        title="Delete Offers"
        message={`Are you sure you want to delete "${selectedOffers?.length}" offers? This action cannot be undone.`}
        confirmText="Delete All"
        onCancel={() => setIsMultipleDeleteModalOpen(false)}
        onConfirm={handleBulkDelete}
      />

      <EditOfferModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        offer={selectedOffer}
        onSubmit={(id, data) => {
          mutate({ id, data });
        }}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Offer"
        message={`Are you sure you want to delete "${offerToDelete?.title}"?`}
        confirmText="Delete"
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          deleteOfferMutation.mutate(offerToDelete.id, {
            onSuccess: () => {
              setIsDeleteModalOpen(false);
            },
          });
        }}
        loading={deleteOfferMutation.isLoading}
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
          <span className="font-medium"> {offers.length}</span> results
        </p>
      </div>
    </div>
  );
}
