import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-hot-toast";
import { logAction } from "../../util/util";

const deleteOffer = async (id) => {
  const offerRef = doc(db, "offers", id);

  // 👉 Fetch the offer document first
  const offerSnap = await getDoc(offerRef);

  if (!offerSnap.exists()) {
    throw new Error("Offer not found");
  }

  const offerData = offerSnap.data();

  // 👉 Now delete the offer
  await deleteDoc(offerRef);

  return { id, offerName: offerData.title || "Unnamed Offer" };
};

const useDeleteOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const result = await toast.promise(
        deleteOffer(id),
        {
          loading: "Deleting offer...",
          success: "Offer deleted successfully!",
          error: "Failed to delete offer.",
        },
        {
          position: "bottom-right",
          style: {
            background: "#333",
            color: "#fff",
          },
        },
      );

      return result;
    },
    onSuccess: async ({ id, offerName }) => {
      await logAction({
        action: "offer_deleted",
        user: "admin@supermall.com", // or from auth
        description: `Offer: "${offerName}" was deleted`,
        refId: id,
      });

      // Invalidate and refetch offers list
      queryClient.invalidateQueries(["offers"]);
    },
  });
};

export default useDeleteOffer;
