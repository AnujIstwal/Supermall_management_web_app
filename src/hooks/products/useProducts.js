import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase"; // path to your firebase.js

const fetchProducts = async ({
  sortField = "productName",
  sortOrder = "asc",
}) => {
  let q = collection(db, "products");

  q = query(q, orderBy(sortField, sortOrder));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const useProducts = ({ sortField, sortOrder }) => {
  return useQuery({
    queryKey: ["products", sortField, sortOrder],
    queryFn: () => fetchProducts({ sortField, sortOrder }),
  });
};

export default useProducts;
