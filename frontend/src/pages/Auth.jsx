import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AuthCard from "../components/auth/AuthCard";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";

export default function Auth() {
  const [mode, setMode] = useState("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          className="w-full max-w-[420px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <AuthCard mode={mode} setMode={setMode}>
            {mode === "login" ? <LoginForm /> : <SignupForm />}
          </AuthCard>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
