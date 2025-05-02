import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const fetchSales = async () => {
  const querySnapshot = await getDocs(collection(db, "salesOverview"));
  const data = querySnapshot.docs.map((doc) => doc.data());

  return data;
};

const useSales = () => {
  return useQuery({
    queryKey: ["sales"],
    queryFn: fetchSales,
  });
};

export default useSales;
