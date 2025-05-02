import React, { useState } from "react";
import { auth, signOut } from "../firebase";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaStore,
  FaBox,
  FaTags,
  FaFileAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
// import OfferSeeder from "../util/OfferSeeder";
// import ProductSeeder from "../util/ProductSeeder";

export default function Navbar() {
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

  return (
    <div className="flex h-full w-full flex-col gap-y-6">
      {/* Logo */}
      <div className="flex items-baseline justify-center gap-x-3">
        <span className="text-4xl font-black text-pink-500">X</span>
        <h1 className="font-mono text-2xl font-bold text-white">Mall</h1>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-2">
        <NavItem to="/dashboard" label="Dashboard" Icon={MdDashboard} />
        <NavItem to="/shops" label="Shops" Icon={FaStore} />
        <NavItem to="/products" label="Products" Icon={FaBox} />
        <NavItem to="/offers" label="Offers" Icon={FaTags} />
        <NavItem to="/logs" label="Logs" Icon={FaFileAlt} />
      </nav>

      {/* Logout */}

      <button
        type="button"
        className="flex w-full cursor-pointer items-center space-x-3 px-4 py-2"
        onClick={handleLogout}
      >
        <FaSignOutAlt className="text-lg text-gray-300" />
        <span className="text-white">Logout</span>
      </button>

      {/* <ProductSeeder /> */}
      {/* <OfferSeeder /> */}
    </div>
  );
}

const NavItem = ({ to, label, Icon, className = "" }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex w-full items-center space-x-3 rounded-full px-4 py-2 transition-all ${isActive ? "bg-[#3A3A3A]" : "hover:bg-[#242424]"} ${className}`
      }
    >
      <Icon className="text-lg text-gray-300" />
      <span className="text-white">{label}</span>
    </NavLink>
  );
};
