import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    if (!saved || saved === "undefined" || saved === "null") {
      return null;
    }
    try {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.id && !parsed._id) {
        parsed._id = parsed.id;
      }
      return parsed;
    } catch (err) {
      console.warn("Invalid user in localStorage, clearing.", err);
      localStorage.removeItem("user");
      return null;
    }
  });

  const login = ({ user, token }) => {
    const normalizedUser = user && user.id && !user._id
      ? { ...user, _id: user.id }
      : user;
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    localStorage.setItem("token", token);
    setUser(normalizedUser);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
