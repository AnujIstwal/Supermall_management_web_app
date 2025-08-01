import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase"; // adjust path

const offers = [
  {
    title: "Summer Bonanza",
    discount: 20,
    validFrom: "2025-04-01",
    validTo: "2025-04-30",
    status: "active",
    shopId: "SH001",
    description: "Get ready for summer with 20% off on all items.",
  },
  {
    title: "Electronics Mega Sale",
    discount: 30,
    validFrom: "2025-03-25",
    validTo: "2025-04-20",
    status: "active",
    shopId: "SH005",
    description: "Unbelievable discounts on top electronic brands.",
  },
  {
    title: "Kids Carnival Offer",
    discount: 15,
    validFrom: "2025-04-10",
    validTo: "2025-04-25",
    status: "active",
    shopId: "SH009",
    description: "Special offers for kidswear and toys.",
  },
  {
    title: "Fashion Fiesta",
    discount: 25,
    validFrom: "2025-04-12",
    validTo: "2025-04-20",
    status: "active",
    shopId: "SH004",
    description: "Upgrade your wardrobe with trendy outfits at 25% off.",
  },
  {
    title: "Book Fest",
    discount: 10,
    validFrom: "2025-04-05",
    validTo: "2025-04-18",
    status: "active",
    shopId: "SH013",
    description: "Flat 10% off on all books and stationery.",
  },
  {
    title: "Jewelry Sparkle Deal",
    discount: 18,
    validFrom: "2025-04-01",
    validTo: "2025-04-16",
    status: "active",
    shopId: "SH051",
    description: "Add some sparkle to your life with exclusive jewelry deals.",
  },
  {
    title: "Home Decor Days",
    discount: 22,
    validFrom: "2025-03-28",
    validTo: "2025-04-17",
    status: "active",
    shopId: "SH008",
    description: "Revamp your space with 22% off on all home decor.",
  },
  {
    title: "Beauty & Wellness Week",
    discount: 12,
    validFrom: "2025-04-08",
    validTo: "2025-04-20",
    status: "active",
    shopId: "SH017",
    description: "Pamper yourself with discounts on wellness products.",
  },
  {
    title: "Summer Clearance",
    discount: 35,
    validFrom: "2025-04-18",
    validTo: "2025-04-30",
    status: "upcoming",
    shopId: "SH014",
    description: "Get ready to clear the racks with 35% off.",
  },
  {
    title: "Gaming Weekend",
    discount: 40,
    validFrom: "2025-04-20",
    validTo: "2025-04-22",
    status: "upcoming",
    shopId: "SH002",
    description: "Massive discounts on gaming consoles and accessories.",
  },
  {
    title: "Mother's Day Special",
    discount: 25,
    validFrom: "2025-05-01",
    validTo: "2025-05-10",
    status: "upcoming",
    shopId: "SH012",
    description: "Celebrate Mom with special offers and surprises.",
  },
  {
    title: "Furniture Fest",
    discount: 28,
    validFrom: "2025-04-21",
    validTo: "2025-05-01",
    status: "upcoming",
    shopId: "SH021",
    description: "Furniture deals that redefine comfort.",
  },
  {
    title: "Laptop Upgrade Offer",
    discount: 15,
    validFrom: "2025-04-19",
    validTo: "2025-04-25",
    status: "upcoming",
    shopId: "SH020",
    description: "Time to upgrade your laptop with our latest deals.",
  },
  {
    title: "Kitchen Essentials Combo",
    discount: 20,
    validFrom: "2025-04-22",
    validTo: "2025-04-28",
    status: "upcoming",
    shopId: "SH018",
    description: "Get more done with top kitchen essentials at lower prices.",
  },
  {
    title: "Fitness Week",
    discount: 18,
    validFrom: "2025-04-15",
    validTo: "2025-04-21",
    status: "upcoming",
    shopId: "SH011",
    description: "Deals to help you stay fit and active.",
  },
  {
    title: "Pet Lovers Offer",
    discount: 12,
    validFrom: "2025-04-16",
    validTo: "2025-04-24",
    status: "upcoming",
    shopId: "SH019",
    description: "Treat your pets with love and discounts.",
  },
  {
    title: "New Year Bash",
    discount: 50,
    validFrom: "2025-01-01",
    validTo: "2025-01-10",
    status: "expired",
    shopId: "SH016",
    description: "Kickstart the year with flat 50% off.",
  },
  {
    title: "Republic Day Sale",
    discount: 30,
    validFrom: "2025-01-20",
    validTo: "2025-01-26",
    status: "expired",
    shopId: "SH022",
    description: "Celebrate with a patriotic discount!",
  },
  {
    title: "Valentine's Week",
    discount: 20,
    validFrom: "2025-02-07",
    validTo: "2025-02-14",
    status: "expired",
    shopId: "SH023",
    description: "Love is in the air – and so are the discounts!",
  },
  {
    title: "Holi Splash",
    discount: 25,
    validFrom: "2025-03-01",
    validTo: "2025-03-08",
    status: "expired",
    shopId: "SH024",
    description: "Add color to your savings this Holi.",
  },
  {
    title: "Spring Essentials",
    discount: 18,
    validFrom: "2025-03-10",
    validTo: "2025-04-01",
    status: "expired",
    shopId: "SH006",
    description: "Gear up for spring with special deals.",
  },
  {
    title: "April First Deals",
    discount: 10,
    validFrom: "2025-04-01",
    validTo: "2025-04-05",
    status: "expired",
    shopId: "SH003",
    description: "No joke—real deals this April Fools!",
  },
  {
    title: "Ramadan Special",
    discount: 22,
    validFrom: "2025-03-15",
    validTo: "2025-04-10",
    status: "expired",
    shopId: "SH007",
    description: "Blessed savings during the holy month.",
  },
  {
    title: "Pre-Summer Clearance",
    discount: 14,
    validFrom: "2025-03-28",
    validTo: "2025-04-12",
    status: "expired",
    shopId: "SH010",
    description: "Clear out the winter stock and save big.",
  },
];

const formatCurrencyINR = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const logAction = async ({ action, user, description, refId }) => {
  try {
    await addDoc(collection(db, "logs"), {
      action,
      user,
      description,
      refId,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.error("Logging failed:", err);
  }
};

export { formatCurrencyINR, offers, logAction };
