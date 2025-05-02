import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase"; // path to your firebase.js

const fetchShops = async ({ sortField = "shopName", sortOrder = "asc" }) => {
  let q = collection(db, "shops");

  q = query(q, orderBy(sortField, sortOrder));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const useShops = ({ sortField, sortOrder }) => {
  return useQuery({
    queryKey: ["shops", sortField, sortOrder],
    queryFn: () => fetchShops({ sortField, sortOrder }),
  });
};

export default useShops;
