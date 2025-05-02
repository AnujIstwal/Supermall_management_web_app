import React, { useState } from "react";
import Navbar from "./Navbar";
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Layout({ children }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-full w-full flex-col md:flex-row">
      {/* Navbar */}
      <div className="hidden h-full basis-[18%] bg-[#292929] px-2 py-6 md:block">
        <Navbar />
      </div>

      <div className="flex h-full basis-[18%] items-center justify-between bg-[#292929] px-6 py-6 md:hidden">
        <div className="flex items-baseline justify-center gap-x-3">
          <span className="text-4xl font-black text-pink-500">X</span>
          <h1 className="font-mono text-2xl font-bold text-white">Mall</h1>
        </div>

        <RxHamburgerMenu
          className="cursor-pointer text-2xl text-white"
          onClick={toggleSidebar}
        />
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 w-64 transform bg-[#292929] text-white ${
          isSidebarOpen ? "-translate-x-0" : "translate-x-full"
        } z-50 transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="flex flex-col gap-6 p-6">
          <button className="mb-4 self-end" onClick={closeSidebar}>
            <RxCross1 className="cursor-pointer text-2xl text-rose-500" />
          </button>

          <NavLink
            to="/dashboard"
            onClick={closeSidebar}
            className="hover:text-pink-400"
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/shops"
            onClick={closeSidebar}
            className="hover:text-pink-400"
          >
            Shops
          </NavLink>
          <NavLink
            to="/products"
            onClick={closeSidebar}
            className="hover:text-pink-400"
          >
            Products
          </NavLink>
          <NavLink
            to="/offers"
            onClick={closeSidebar}
            className="hover:text-pink-400"
          >
            Offers
          </NavLink>
          <NavLink
            to="/logs"
            onClick={closeSidebar}
            className="hover:text-pink-400"
          >
            Logs
          </NavLink>

          <button
            onClick={handleLogout}
            className="mt-auto text-red-400 hover:text-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex basis-[100%] items-center justify-center bg-[#292929] p-3 md:basis-[82%]">
        <div className="h-full w-full rounded-xl bg-gradient-to-br from-[#F6F5F5] to-[#D3D3D3] px-4 py-2 md:px-6 md:py-4">
          {children}
        </div>
      </div>
    </div>
  );
}
