import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import api from "../../api/axios";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function LoginForm() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      // backend should return { user, token }
      login(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed"
      );
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

      <Input
        label="Password"
        icon={Lock}
        rightIcon={showPassword ? EyeOff : Eye}
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onRightIconClick={() =>
          setShowPassword((prev) => !prev)
        }
        required
      />

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      <Button disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
