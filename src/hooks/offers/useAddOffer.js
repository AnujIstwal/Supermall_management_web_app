import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import toast from "react-hot-toast";
import { logAction } from "../../util/util";

const addOffer = async (offerData) => {
  const newOffer = { ...offerData, createdAt: serverTimestamp() };

  const docRef = await addDoc(collection(db, "offers"), newOffer);
  return { ...newOffer, id: docRef.id };
};

const useAddOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (offerData) => {
      const result = await toast.promise(
        addOffer(offerData),
        {
          loading: "Adding offer...",
          success: "Offer added successfully!",
          error: "Failed to add offer.",
        },
        {
          position: "bottom-center",
          style: { background: "#333", color: "#fff" },
        },
      );

      return result;
    },
    onSuccess: async ({ id, title }) => {
      await logAction({
        action: "offer_created",
        user: "admin@supermall.com",
        description: `Offer: "${title}" added.`,
        refId: id,
      });

      // Invalidate and refetch offers list
      queryClient.invalidateQueries(["offers"]);
    },
  });
};

export default useAddOffer;
