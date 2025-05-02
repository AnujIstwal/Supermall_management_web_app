import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-hot-toast";
import { logAction } from "../util/util";

const deleteShop = async (id) => {
  const shopRef = doc(db, "shops", id);

  // 👉 Fetch the shop document first
  const shopSnap = await getDoc(shopRef);

  if (!shopSnap.exists()) {
    throw new Error("Shop not found");
  }

  const shopData = shopSnap.data();

  // 👉 Now delete the shop
  await deleteDoc(shopRef);

  return { id, shopName: shopData.shopName || "Unnamed Shop" };
};

const useDeleteShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const deletedShop = await toast.promise(
        deleteShop(id),
        {
          loading: "Deleting shop...",
          success: "Shop deleted successfully!",
          error: "Failed to delete shop.",
        },
        {
          position: "bottom-right",
          style: {
            background: "#333",
            color: "#fff",
          },
        },
      );

      return deletedShop;
    },
    onSuccess: async ({ id, shopName }) => {
      /// console.log({ shopId });
      await logAction({
        action: "shop_deleted",
        user: "admin@supermall.com", // or from auth
        description: `Shop: "${shopName}" was deleted`,
        refId: id,
      });

      // Invalidate and refetch shops list
      queryClient.invalidateQueries(["shops"]);
    },
  });
};

export default useDeleteShop;
