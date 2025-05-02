import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import toast from "react-hot-toast";
import { logAction } from "../util/util";

const addShop = async (shopData) => {
  const snapshot = await getDocs(collection(db, "shops"));
  const nextId = `SH${(snapshot.size + 1).toString().padStart(3, "0")}`;

  const newShop = { shopId: nextId, ...shopData, createdAt: serverTimestamp() };

  const docRef = await addDoc(collection(db, "shops"), newShop);
  return { ...newShop, id: docRef.id };
};

const useAddShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (shopData) => {
      const result = await toast.promise(
        addShop(shopData),
        {
          loading: "Adding shop...",
          success: "Shop added successfully!",
          error: "Failed to add shop.",
        },
        {
          position: "bottom-center",
          style: { background: "#333", color: "#fff" },
        },
      );

      return result;
    },
    onSuccess: async (newShop) => {
      // Invalidate and refetch shops list
      await logAction({
        action: "shop_created",
        user: "admin@supermall.com",
        description: `Shop "${newShop.shopName}" added with ID ${newShop.shopId}`,
        refId: newShop.shopId,
      });
      queryClient.invalidateQueries(["shops"]);
    },
  });
};

export default useAddShop;
