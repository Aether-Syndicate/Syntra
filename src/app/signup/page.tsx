"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// The 4 Core Twin Avatars mapped out in Phase 1
const AVATAR_OPTIONS = [
  { id: 1, name: "Cyberpunk", icon: "🌌" },
  { id: 2, name: "Minimalist", icon: "⚪" },
  { id: 3, name: "Hologram", icon: "💠" },
  { id: 4, name: "Corporate", icon: "🏢" },
];

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    avatarId: 1, // Defaults to Cyberpunk
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initialize Twin.");
      }

      // Successful Registration - Redirect to the God Endpoint Dashboard
      router.push("/dashboard");
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100 p-4">
      {/* Dynamic Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-zinc-950 -z-10" />

      <div className="w-full max-w-md bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 shadow-2xl backdrop-blur-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Initialize Syntra</h1>
          <p className="text-sm text-zinc-400">
            Your Digital Twin analyzes your health, finance, and career patterns to generate personalized projections.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          {/* Avatar Selection (The Wow Factor UX) */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Select Twin Interface
            </label>
            <div className="grid grid-cols-4 gap-3">
              {AVATAR_OPTIONS.map((avatar) => (
                <div
                  key={avatar.id}
                  onClick={() => setFormData({ ...formData, avatarId: avatar.id })}
                  className={`cursor-pointer flex flex-col items-center p-3 rounded-xl border transition-all ${
                    formData.avatarId === avatar.id
                      ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                      : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                  }`}
                >
                  <span className="text-2xl mb-1">{avatar.icon}</span>
                  <span className="text-[10px] text-zinc-400">{avatar.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Standard Inputs */}
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              required
              placeholder="Your Name"
              onChange={handleChange}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <input
              type="email"
              name="email"
              required
              placeholder="Secure Email"
              onChange={handleChange}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <div className="flex gap-4">
              <input
                type="password"
                name="password"
                required
                placeholder="Password"
                onChange={handleChange}
                className="w-2/3 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                onChange={handleChange}
                className="w-1/3 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Submit Button with Loading State */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {loading ? "Syncing Neural Link..." : "Initialize Digital Twin"}
          </button>
        </form>
        
        {/* Privacy Trust Badge */}
        <div className="mt-6 text-center">
          <p className="text-[10px] text-zinc-600 flex items-center justify-center gap-1">
            🔒 Secured via AES-256 Encryption & PII Anonymization
          </p>
        </div>
      </div>
    </div>
  );
}