import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AuthCard({ mode, setMode, children }) {
  const navigate = useNavigate();
  const isAuthMode = mode === "login" || mode === "signup";

  return (
    <div className="w-full max-w-[90vw] sm:max-w-[500px] text-center">
      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 rounded-xl bg-black flex items-center justify-center">
          <GraduationCap className="w-7 h-7 text-white" />
        </div>

        <h1 className="mt-4 text-2xl font-semibold">Campus Hub</h1>
        <p className="mt-1 text-gray-500">
          {mode === "login" && "Welcome back!"}
          {mode === "signup" && "Join the campus community"}
          {mode === "forgot" && "Reset your password"}
          {mode === "reset" && "Set a new password"}
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-black bg-white p-8 shadow-[10px_10px_0px_0px_black]">
        {children}

        {/* Footer */}
        {isAuthMode && (
          <div className="mt-6 text-sm text-center">
            {mode === "login" ? (
              <>
                <span className="text-gray-500">
                  Don’t have an account?{" "}
                </span>
                <button
                  onClick={() => setMode("signup")}
                  className="font-medium text-black hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                <span className="text-gray-500">
                  Already have an account?{" "}
                </span>
                <button
                  onClick={() => setMode("login")}
                  className="font-medium text-black hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Back */}
      <div onClick={() => navigate("/")} className="mt-8 text-sm text-gray-500 cursor-pointer">
        ← Back to home
      </div>
    </div>
  );
}
