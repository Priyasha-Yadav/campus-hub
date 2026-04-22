import { useState } from "react";
import api from "../../api/axios";
import { KeyRound, Lock } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function ResetPasswordForm({ defaultToken = "", onBack, onReset }) {
  const [token, setToken] = useState(defaultToken);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      await api.post("/auth/reset-password", { token, password });
      setInfo("Password updated. You can sign in now.");
      if (onReset) onReset();
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Reset Token"
        icon={KeyRound}
        placeholder="Paste reset token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        required
      />

      <Input
        label="New Password"
        icon={Lock}
        type="password"
        minLength={6}
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {info && <p className="text-sm text-gray-600">{info}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button disabled={loading}>
        {loading ? "Updating..." : "Reset password"}
      </Button>

      <button
        type="button"
        onClick={onBack}
        className="w-full text-sm text-gray-500 hover:underline"
      >
        Back to sign in
      </button>
    </form>
  );
}
