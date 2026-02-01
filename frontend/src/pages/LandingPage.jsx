// pages/Landing.jsx
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold">Campus Hub</h1>
      <p className="mt-2 text-gray-500">
        Buy, study, and connect on campus.
      </p>

      <Link
        to="/auth"
        className="mt-6 rounded-lg bg-black px-6 py-3 text-white"
      >
        Get started
      </Link>
    </div>
  );
}
