import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import api from "../../api/axios";
import { Mail, Lock, User } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function SignupForm() {
  const { login } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/signup", {
        displayName,
        email,
        password,
      });

      // backend returns { user, token }
      login(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Display Name"
        icon={User}
        placeholder="Priyasha Yadav"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        required
      />

      <Input
        label="Email"
        icon={Mail}
        type="email"
        placeholder="you@university.edu"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        label="Password"
        icon={Lock}
        type="password"
        minLength={6}
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      <Button disabled={loading}>
        {loading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}
