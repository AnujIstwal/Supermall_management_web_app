import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import toast from "react-hot-toast";
import { logAction } from "../../util/util";

const addProduct = async (productData) => {
  const newProduct = { ...productData, createdAt: serverTimestamp() };

  const docRef = await addDoc(collection(db, "products"), newProduct);
  return { ...newProduct, id: docRef.id };
};

const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData) => {
      const result = await toast.promise(
        addProduct(productData),
        {
          loading: "Adding product...",
          success: "Product added successfully!",
          error: "Failed to add product.",
        },
        {
          position: "bottom-center",
          style: { background: "#333", color: "#fff" },
        },
      );

      return result;
    },
    onSuccess: async ({ productName, id }) => {
      await logAction({
        action: "product_added",
        user: "admin@supermall.com",
        description: `Product: "${productName}" added.`,
        refId: id,
      });

      // Invalidate and refetch products list
      queryClient.invalidateQueries(["products"]);
    },
  });
};

export default useAddProduct;
