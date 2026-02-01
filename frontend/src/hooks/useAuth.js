import { useContext } from "react";
import { useAuthContext } from "../context/AuthContext";

const useAuth = () => {
  const context = useAuthContext();

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

export default useAuth;
