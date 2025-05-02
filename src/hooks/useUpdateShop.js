import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { logAction } from "../util/util";

// Function to update a shop
const updateShop = async ({ id, data }) => {
  const shopRef = doc(db, "shops", id);

  await updateDoc(shopRef, data);

  // 👉 Fetch updated shop name (optional, but better for log description)
  const updatedSnap = await getDoc(shopRef);

  if (!updatedSnap.exists()) {
    throw new Error("Shop not found after update");
  }

  const updatedShopData = updatedSnap.data();

  return { id, shopName: updatedShopData.shopName || "Unnamed Shop" };
};

const useUpdateShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const updatedShop = await toast.promise(
        updateShop({ id, data }),
        {
          loading: "Updating shop...",
          success: "Shop updated successfully",
          error: "Error updating shop",
        },
        {
          position: "bottom-right",
          style: {
            background: "#333",
            color: "#fff",
          },
        },
      );

      return updatedShop;
    },
    onSuccess: async ({ id, shopName }) => {
      await logAction({
        action: "shop_updated",
        user: "admin@supermall.com", // or get dynamically
        description: `Shop "${shopName}" was updated`,
        refId: id,
      });

      queryClient.invalidateQueries(["shops"]);
    },
  });
};

export default useUpdateShop;
