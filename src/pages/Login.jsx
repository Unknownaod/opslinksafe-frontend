import { useState } from "react";
import api from "../api/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Adjust endpoint if your backend uses a different path
      const res = await api.post("/auth/login", { username, password });

      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-[#081230] to-[#0f1a40]">
      <div className="bg-white/5 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-[400px] border border-white/10">
        <h1 className="text-3xl font-bold text-center text-blue-400 mb-2">
          OpsLink SAFE
        </h1>
        <p className="text-center text-xs text-gray-400 mb-6">
          Fire & EMS Computer-Aided Dispatch
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-300 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            className="p-3 bg-[#101b3a] rounded text-white outline-none border border-[#1c2a5c] text-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 bg-[#101b3a] rounded text-white outline-none border border-[#1c2a5c] text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 transition-all p-3 rounded font-semibold text-white text-sm"
          >
            Sign in
          </button>
        </form>

        <p className="text-center text-gray-500 text-[11px] mt-6">
          Authorized personnel only. All access is logged.
        </p>
      </div>
    </div>
  );
}
