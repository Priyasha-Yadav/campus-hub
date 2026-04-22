import { useState } from "react";
import api from "../../api/axios";
import { Mail } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function ForgotPasswordForm({ onBack, onSent }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      const res = await api.post("/auth/forgot-password", { email });
      const token = res.data?.data?.resetToken;
      setInfo("If the email exists, a reset link was sent.");
      if (onSent) onSent(token);
    } catch (err) {
      setError(err.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Email"
        icon={Mail}
        placeholder="you@university.edu"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      {info && <p className="text-sm text-gray-600">{info}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button disabled={loading}>
        {loading ? "Sending..." : "Send reset link"}
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
