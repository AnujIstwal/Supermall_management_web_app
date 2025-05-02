import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const fetchSummary = async () => {
  const querySnapshot = await getDocs(collection(db, "dashboardSummary"));
  const data = querySnapshot.docs.map((doc) => doc.data());

  return data;
};

const useSummary = () => {
  return useQuery({
    queryKey: ["summary"],
    queryFn: fetchSummary,
  });
};

export default useSummary;
