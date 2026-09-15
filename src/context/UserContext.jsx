import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

const DEFAULT_PROFILE = {
  name: "Riya Shah",
  email: "riya@handloomexports.in",
  phone: "+91 98765 43210",
  role: "Founder & CFO",
  businessName: "Riya Handloom Exports",
  gstin: "27AABCR1234F1Z5",
  location: "Mumbai, Maharashtra, India",
  currency: "INR (₹)",
  gradient: "from-blue-600 to-cyan-500",
  avatarUrl: null,
};

const UserContext = createContext(null);

export function getInitials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "RS"
  );
}

export function UserProvider({ children }) {
  const { currentUser, updateUserData } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Active user data is sourced from authenticated session
  const user = currentUser || DEFAULT_PROFILE;

  const updateProfile = (updates) => {
    if (updateUserData) {
      updateUserData(updates);
    }
  };

  const initials = getInitials(user.name);

  return (
    <UserContext.Provider
      value={{
        user,
        updateProfile,
        initials,
        isProfileOpen,
        setIsProfileOpen,
        openProfile: () => setIsProfileOpen(true),
        closeProfile: () => setIsProfileOpen(false),
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
