import { useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import AuthCard from "../components/auth/AuthCard";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";
import ResetPasswordForm from "../components/auth/ResetPasswordForm";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [resetToken, setResetToken] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <AnimatePresence mode="wait">
        <Motion.div
          key={mode}
          className="w-full max-w-[420px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <AuthCard mode={mode} setMode={setMode}>
            {mode === "login" && <LoginForm onForgot={() => setMode("forgot")} />}
            {mode === "signup" && <SignupForm />}
            {mode === "forgot" && (
              <ForgotPasswordForm
                onBack={() => setMode("login")}
                onSent={(token) => {
                  if (token) setResetToken(token);
                  setMode("reset");
                }}
              />
            )}
            {mode === "reset" && (
              <ResetPasswordForm
                defaultToken={resetToken}
                onBack={() => setMode("login")}
                onReset={() => setMode("login")}
              />
            )}
          </AuthCard>
        </Motion.div>
      </AnimatePresence>
    </div>
  );
}
