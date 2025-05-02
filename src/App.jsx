import { Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Shops from "./pages/Shops";
import Products from "./pages/Products";
import Offers from "./pages/Offers";
import { useEffect } from "react";
import Login from "./pages/Login";
import ProtectedRoute from "./util/ProtectedRoute";
import Layout from "./components/Layout";
import { Toaster } from "react-hot-toast";
import Logs from "./pages/Logs";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (window.location.pathname === "/") {
      if (user) {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#292929] md:h-screen">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/shops"
          element={
            <Layout>
              <Shops />
            </Layout>
          }
        />
        <Route
          path="/products"
          element={
            <Layout>
              <Products />
            </Layout>
          }
        />
        <Route
          path="/offers"
          element={
            <Layout>
              <Offers />
            </Layout>
          }
        />
        <Route
          path="/logs"
          element={
            <Layout>
              <Logs />
            </Layout>
          }
        />
      </Routes>

      <Toaster
        toastOptions={{
          className: "text-[.9rem]",
          duration: 5000,
          style: {
            background: "#ffffff",
            color: "#1f2937",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#d1fae5",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fee2e2",
            },
          },
        }}
      />
    </div>
  );
}

export default App;
