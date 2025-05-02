import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase"; // adjust path
import { offers } from "./util";

const seedOffersToFirebase = async () => {
  const offersRef = collection(db, "offers");

  try {
    for (let offer of offers) {
      await addDoc(offersRef, {
        ...offer,
        validFrom: new Date(offer.validFrom),
        validTo: new Date(offer.validTo),
      });
    }
    console.log("✅ Offers seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding offers:", error);
  }
};

export default function OfferSeeder() {
  return (
    <div>
      <button
        onClick={seedOffersToFirebase}
        className="bg-purple-500 px-4 py-2 text-white"
      >
        Seed Offers
      </button>
    </div>
  );
}
