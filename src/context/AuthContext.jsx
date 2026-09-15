import React, { createContext, useContext, useState, useEffect } from "react";

const USERS_DB_KEY = "finguard_users_db";
const SESSION_KEY = "finguard_current_session";

const INITIAL_USERS = [
  {
    id: "usr_1",
    name: "Riya Shah",
    email: "riya@handloomexports.in",
    password: "Admin@123",
    role: "Founder & CFO",
    businessName: "Riya Handloom Exports",
    phone: "+91 98765 43210",
    gstin: "27AABCR1234F1Z5",
    location: "Mumbai, Maharashtra, India",
    gradient: "from-blue-600 to-cyan-500",
    createdAt: "2026-01-15T10:00:00.000Z",
  },
  {
    id: "usr_2",
    name: "Aman Verma",
    email: "demo@finguard.ai",
    password: "Demo@123",
    role: "Financial Analyst",
    businessName: "Apex FinTech Solutions",
    phone: "+91 91234 56789",
    gstin: "29AABCU9603R1ZM",
    location: "Bengaluru, Karnataka, India",
    gradient: "from-blue-900 to-blue-600",
    createdAt: "2026-02-01T10:00:00.000Z",
  },
  {
    id: "usr_3",
    name: "Janarthanan V",
    email: "janarthananv456@gmail.com",
    password: "Jana@Project",
    role: "Financial CEO",
    businessName: "MJ Solutions",
    phone: "+91 8838389213",
    gstin: "29AABCU9603R1ZM",
    location: "Coorg, Karnataka, India",
    gradient: "from-indigo-600 to-blue-500",
    createdAt: "2026-04-18T10:00:00.000Z",
  },
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialize dummy database from localStorage or default seed, ensuring all initial users exist
  const [usersDb, setUsersDb] = useState(() => {
    try {
      const stored = localStorage.getItem(USERS_DB_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge any new initial seed users into stored database
          const existingIds = new Set(parsed.map((u) => u.id));
          const missingInitial = INITIAL_USERS.filter((u) => !existingIds.has(u.id));
          return [...parsed, ...missingInitial];
        }
      }
    } catch (err) {
      console.warn("Failed to load users DB:", err);
    }
    return INITIAL_USERS;
  });

  // Initialize current session
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  });

  // Sync users database changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDb));
    } catch (e) {
      console.warn("Could not persist users db:", e);
    }
  }, [usersDb]);

  // Sync current user session to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch (e) {
      console.warn("Could not persist session:", e);
    }
  }, [currentUser]);

  // Helper to fetch the most up-to-date database from localStorage
  const getFreshDb = () => {
    try {
      const stored = localStorage.getItem(USERS_DB_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Could not read fresh DB:", e);
    }
    return usersDb;
  };

  // Login handler with live database checking
  const login = (email, password) => {
    const freshDb = getFreshDb();
    const trimmedEmail = email?.trim().toLowerCase();
    const user = freshDb.find(
      (u) => u.email.toLowerCase() === trimmedEmail && u.password === password
    );

    if (user) {
      // Create session without raw password
      const { password: _, ...safeUser } = user;
      setCurrentUser(safeUser);
      try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
      } catch (e) {
        console.warn("Could not store session:", e);
      }
      return { success: true, user: safeUser };
    }

    return {
      success: false,
      message: "Invalid email or password. Please check your credentials.",
    };
  };

  // Sign up / Register new user into dummy database
  const signup = ({ name, email, password, businessName, role }) => {
    const freshDb = getFreshDb();
    const trimmedEmail = email?.trim().toLowerCase();

    // Check if user already exists
    const existing = freshDb.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return {
        success: false,
        message: "An account with this email already exists. Please sign in instead.",
      };
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: name?.trim() || "New User",
      email: trimmedEmail,
      password,
      businessName: businessName?.trim() || "My Enterprise",
      role: role?.trim() || "Business Owner",
      phone: "+91 98000 00000",
      gstin: "27AAAAA0000A1Z5",
      location: "Mumbai, India",
      gradient: "from-blue-600 to-cyan-500",
      createdAt: new Date().toISOString(),
    };

    const updatedDb = [...freshDb, newUser];

    // Persist immediately to localStorage
    try {
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(updatedDb));
    } catch (e) {
      console.warn("Could not save new user to database:", e);
    }

    setUsersDb(updatedDb);

    const { password: _, ...safeUser } = newUser;
    setCurrentUser(safeUser);
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
    } catch (e) {
      console.warn("Could not set session:", e);
    }

    return { success: true, user: safeUser };
  };

  // Logout handler
  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (e) {
      console.warn("Could not clear session:", e);
    }
  };

  // Update current user details in both session and database
  const updateUserData = (updatedFields) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);

    const freshDb = getFreshDb();
    const updatedDb = freshDb.map((u) =>
      u.id === currentUser.id ? { ...u, ...updatedFields } : u
    );

    setUsersDb(updatedDb);
    try {
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(updatedDb));
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not persist updated user:", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        signup,
        logout,
        updateUserData,
        usersDb,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
