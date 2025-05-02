import { faker } from "@faker-js/faker";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase"; // adjust the path

const seedFakeProducts = async () => {
  const categories = [
    "Electronics",
    "Clothing",
    "Sports",
    "Toys",
    "Books",
    "Food",
  ];
  const shopIds = Array.from(
    { length: 20 },
    (_, i) => `SH${(i + 1).toString().padStart(3, "0")}`,
  );

  try {
    for (let i = 0; i < 100; i++) {
      const product = {
        productName: faker.commerce.productName(),
        category: faker.helpers.arrayElement(categories),
        price: parseInt(faker.commerce.price(100, 100000)),
        shopId: faker.helpers.arrayElement(shopIds),
        stock: faker.number.int({ min: 0, max: 100 }),
        status: faker.helpers.arrayElement(["active", "inactive"]),
        createdAt: new Date(),
      };

      await addDoc(collection(db, "products"), product);
    }

    console.log("✅ 100 fake products seeded!");
  } catch (error) {
    console.error("❌ Error seeding products:", error);
  }
};

export default function ProductSeeder() {
  return (
    <div className="p-6 text-center">
      <button
        className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
        onClick={seedFakeProducts}
      >
        Seed Product Data
      </button>
    </div>
  );
}
