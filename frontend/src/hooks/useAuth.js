import { useAuthContext } from "../context/useAuthContext";

const useAuth = () => {
  const context = useAuthContext();

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

export default useAuth;
