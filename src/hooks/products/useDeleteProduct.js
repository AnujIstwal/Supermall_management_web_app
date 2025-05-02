import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-hot-toast";
import { logAction } from "../../util/util";

const deleteProduct = async (id) => {
  const productRef = doc(db, "products", id);

  // 👉 Fetch the product document first
  const productSnap = await getDoc(productRef);

  if (!productSnap.exists()) {
    throw new Error("Product not found");
  }

  const productData = productSnap.data();

  // 👉 Now delete the product
  await deleteDoc(productRef);

  return { id, productName: productData.productName || "Unnamed Product" };
};

const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const result = await toast.promise(
        deleteProduct(id),
        {
          loading: "Deleting product...",
          success: "Product deleted successfully!",
          error: "Failed to delete product.",
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
    onSuccess: async ({ id, productName }) => {
      await logAction({
        action: "product_deleted",
        user: "admin@supermall.com", // or from auth
        description: `Product: "${productName}" was deleted`,
        refId: id,
      });

      // Invalidate and refetch products list
      queryClient.invalidateQueries(["products"]);
    },
  });
};

export default useDeleteProduct;
