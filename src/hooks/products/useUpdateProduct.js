import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { logAction } from "../../util/util";

// Function to update a Product
const updateProduct = async ({ id, data }) => {
  const productRef = doc(db, "products", id);

  await updateDoc(productRef, data);

  // 👉 Fetch updated Product name (optional, but better for log description)
  const updatedSnap = await getDoc(productRef);

  if (!updatedSnap.exists()) {
    throw new Error("Product not found after update");
  }

  const updatedProductData = updatedSnap.data();

  return {
    id,
    productName: updatedProductData.productName || "Unnamed Product",
  };
};

const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await toast.promise(
        updateProduct({ id, data }),
        {
          loading: "Updating product...",
          success: "Product updated successfully",
          error: "Error updating product",
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
    onSuccess: async ({ productName, id }) => {
      await logAction({
        action: "product_updated",
        user: "admin@supermall.com", // or get dynamically
        description: `Product: "${productName}" was updated`,
        refId: id,
      });

      queryClient.invalidateQueries(["products"]);
    },
  });
};

export default useUpdateProduct;
