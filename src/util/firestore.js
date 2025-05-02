import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const addShop = async (shopData) => {
  try {
    const docRef = await addDoc(collection(db, "shops"), {
      ...shopData,
      createdAt: serverTimestamp(),
    });
    console.log("Shop added with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding shop:", error);
  }
};

export { addShop };
