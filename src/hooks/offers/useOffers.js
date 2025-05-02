import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase"; // path to your firebase.js

const fetchOffers = async ({ sortField = "title", sortOrder = "asc" }) => {
  let q = collection(db, "offers");

  q = query(q, orderBy(sortField, sortOrder));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const useOffers = ({ sortField, sortOrder }) => {
  return useQuery({
    queryKey: ["offers", sortField, sortOrder],
    queryFn: () => fetchOffers({ sortField, sortOrder }),
  });
};

export default useOffers;
