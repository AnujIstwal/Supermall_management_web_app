import React from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { faker } from "@faker-js/faker";

export default function ShopSeeder() {
  const generateShops = async () => {
    const shopCollection = collection(db, "shops");

    for (let i = 1; i <= 56; i++) {
      const shopData = {
        shopId: `SH${i.toString().padStart(3, "0")}`,
        shopName: faker.company.name(),
        category: faker.commerce.department(),
        floor: `${faker.helpers.arrayElement(["1st", "2nd", "3rd", "4th"])}`,
        contact: `+91 9${faker.string.numeric(9)}`, // Indian mobile format,
        status: faker.helpers.arrayElement(["active", "inactive"]),
      };

      await addDoc(shopCollection, shopData);
    }

    alert("🔥 56 shop documents seeded!");
  };

  return (
    <div className="p-6 text-center">
      <button
        className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
        onClick={generateShops}
      >
        Seed Shop Data
      </button>
    </div>
  );
}
