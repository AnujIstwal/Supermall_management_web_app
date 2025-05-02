import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { logAction } from "../../util/util";

// Function to update a Offer
const updateOffer = async ({ id, data }) => {
  const offerRef = doc(db, "offers", id);

  await updateDoc(offerRef, data);

  // 👉 Fetch updated Offer name (optional, but better for log description)
  const updatedSnap = await getDoc(offerRef);

  if (!updatedSnap.exists()) {
    throw new Error("Offer not found after update");
  }

  const updatedOfferData = updatedSnap.data();

  return { id, offerName: updatedOfferData.offerName || "Unnamed Offer" };
};

const useUpdateOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await toast.promise(
        updateOffer({ id, data }),
        {
          loading: "Updating offer...",
          success: "Offer updated successfully",
          error: "Error updating offer",
        },
        {
          position: "bottom-right",
          style: {
            background: "#333",
            color: "#fff",
          },
        },
      );
      return res;
    },
    onSuccess: async ({ id, offerName }) => {
      await logAction({
        action: "offer_updated",
        user: "admin@supermall.com", // or get dynamically
        description: `Offer: "${offerName}" was updated`,
        refId: id,
      });

      queryClient.invalidateQueries(["offers"]);
    },
  });
};

export default useUpdateOffer;
