# 🏢 Super Mall Admin Dashboard

A modern and feature-rich admin dashboard for managing shops, products, and offers inside a multi-floor Super Mall. Built using **React**, **Firebase**, and **Tailwind CSS** with dynamic charts, modals, filters, and real-time data.

---

## ✨ Features

- 🏪 **Shop Management** — Add, edit, delete, and filter shops by floor and status
- 📦 **Product Management** — Manage products with stock, category, and shop linkage
- 🎁 **Offer System** — Handle time-based offers with dynamic status (active/upcoming/expired)
- 📊 **Dashboard** — Analytics with responsive charts and counters
- 🔍 **Search + Filter** — Smart filters by status, floor, and search queries
- ✅ **Modals with Validation** — Add/Edit forms with full validation using `react-hook-form`
- 📂 **Firebase Integration** — Firestore for database, Auth for login, Storage for uploads
- 📱 **Responsive Design** — Mobile sidebar, collapsible UI, clean layout
- 🔥 **React Query** — For caching, mutations, and refetching
- 🔐 **Admin Login** — Secure login panel with form validation and session handling

---

## 🚀 Tech Stack

| Tech           | Role                        |
|----------------|-----------------------------|
| React + Vite   | Frontend Framework & Bundler|
| Tailwind CSS   | UI Styling Framework        |
| Firebase       | Backend: Firestore, Auth, Storage |
| React Query    | Data Fetching & Caching     |
| react-hook-form| Form Validation             |
| react-hot-toast| Notifications & Feedback    |
| recharts       | Dynamic Charting            |

---

## 🔧 Setup & Run Locally

1. **Clone the Repo**

```bash
git clone https://github.com/AnujIstwal/Supermall-management_web_app.git
cd Supermall-management_web_app



### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Firebase Config (optional)

Create a `.env` file in the root and add:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Run the App

```bash
npm run dev
```

---

## 📸 Screenshots

> Add some UI screenshots or dashboard preview here

![image](https://github.com/user-attachments/assets/f489441b-5d3b-48fb-a9fc-ed04fd880732)

![image](https://github.com/user-attachments/assets/a400ded2-b1e8-4219-bc49-d38a3dc8b5a3)

---

## 🌐 Live Demo

🔗 [Visit the Live App](https://x-mall-pvt.netlify.app/)

---

## 📁 Folder Structure

```
src/
├── components/     # Reusable UI components
├── features/       # Shops, Products, Offers
├── pages/          # Route-level pages
├── hooks/          # Custom React hooks
├── firebase.js     # Firebase config
├── App.jsx
└── main.jsx
```

---


## 👨‍💻 Author

Made with ❤️ by [Anuj](https://github.com/AnujIstwal)
