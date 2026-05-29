"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import "./signup.css";

// ─── Syntra Monogram Logo ────────────────────────────────────────────────────
function SyntraMonogram() {
  return (
    <svg
      width="52"
      height="52"
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <defs>
        <radialGradient id="glow-a" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#7EB2FF" stopOpacity="1" />
          <stop offset="100%" stopColor="#2563EB" stopOpacity="0.6" />
        </radialGradient>
        <radialGradient id="glow-b" cx="60%" cy="60%" r="60%">
          <stop offset="0%" stopColor="#A78BFA" stopOpacity="1" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.6" />
        </radialGradient>
        <filter id="blur-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="soft-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
          </feMerge>
        </filter>
      </defs>

      {/* Ambient glow behind */}
      <ellipse cx="20" cy="26" rx="14" ry="14" fill="url(#glow-a)" filter="url(#soft-glow)" opacity="0.5" />
      <ellipse cx="32" cy="26" rx="14" ry="14" fill="url(#glow-b)" filter="url(#soft-glow)" opacity="0.5" />

      {/* Left circle */}
      <circle
        cx="20"
        cy="26"
        r="13"
        fill="none"
        stroke="url(#glow-a)"
        strokeWidth="2.2"
        filter="url(#blur-glow)"
        opacity="0.95"
      />
      {/* Right circle */}
      <circle
        cx="32"
        cy="26"
        r="13"
        fill="none"
        stroke="url(#glow-b)"
        strokeWidth="2.2"
        filter="url(#blur-glow)"
        opacity="0.95"
      />

      {/* Intersection fill — vesica piscis */}
      <path
        d="M26 14.2 C29.8 17.8 31.8 21.8 31.8 26 C31.8 30.2 29.8 34.2 26 37.8 C22.2 34.2 20.2 30.2 20.2 26 C20.2 21.8 22.2 17.8 26 14.2 Z"
        fill="white"
        opacity="0.08"
      />

      {/* Helix arc — top cross stroke */}
      <path
        d="M20.5 19 Q26 15 31.5 19"
        stroke="white"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
        opacity="0.55"
      />
      {/* Helix arc — bottom cross stroke */}
      <path
        d="M20.5 33 Q26 37 31.5 33"
        stroke="white"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* Center vertical spine */}
      <line x1="26" y1="14" x2="26" y2="38" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />

      {/* Center dot — synchronization point */}
      <circle cx="26" cy="26" r="2.5" fill="white" opacity="0.9" />
      <circle cx="26" cy="26" r="1.2" fill="#A5C8FF" />
    </svg>
  );
}

// ─── Premium Syntra Brand Avatars ────────────────────────────────────────────
const AVATAR_OPTIONS = [
  {
    id: 1,
    name: "Aether",
    tagline: "Vitality · Metabolic Balance",
    accent: "#3B82F6",
    bg: "linear-gradient(135deg, #0f1e3d 0%, #0d2d5e 50%, #0a1a3a 100%)",
    glow: "rgba(59,130,246,0.55)",
    ring: "#3B82F6",
    svg: (
      <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" width="64" height="64">
        <defs>
          <radialGradient id="ae-face" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#BFDBFE" />
            <stop offset="100%" stopColor="#60A5FA" />
          </radialGradient>
          <radialGradient id="ae-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#1E40AF" stopOpacity="0" />
          </radialGradient>
          <filter id="ae-blur">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>
        {/* Ambient halo */}
        <circle cx="40" cy="40" r="36" fill="url(#ae-glow)" filter="url(#ae-blur)" />
        {/* Head */}
        <ellipse cx="40" cy="38" rx="20" ry="22" fill="url(#ae-face)" />
        {/* Geometric crown lines */}
        <line x1="40" y1="16" x2="40" y2="10" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <line x1="33" y1="19" x2="29" y2="13" stroke="#93C5FD" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
        <line x1="47" y1="19" x2="51" y2="13" stroke="#93C5FD" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
        {/* Circuit temple marks */}
        <path d="M20 38 H15 V32" stroke="#60A5FA" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7" />
        <path d="M60 38 H65 V32" stroke="#60A5FA" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7" />
        {/* Eyes — glowing orbs */}
        <ellipse cx="33" cy="37" rx="4.5" ry="4.5" fill="#0EA5E9" />
        <ellipse cx="47" cy="37" rx="4.5" ry="4.5" fill="#0EA5E9" />
        <ellipse cx="33" cy="37" rx="2.5" ry="2.5" fill="#E0F2FE" />
        <ellipse cx="47" cy="37" rx="2.5" ry="2.5" fill="#E0F2FE" />
        <circle cx="33" cy="37" r="1" fill="#0369A1" />
        <circle cx="47" cy="37" r="1" fill="#0369A1" />
        <circle cx="34" cy="35.8" r="0.8" fill="white" opacity="0.9" />
        <circle cx="48" cy="35.8" r="0.8" fill="white" opacity="0.9" />
        {/* Nose bridge — minimal line */}
        <line x1="40" y1="42" x2="40" y2="46" stroke="#93C5FD" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        {/* Lips — neutral arc */}
        <path d="M35 52 Q40 56 45 52" stroke="#BFDBFE" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.9" />
        {/* Hex data marks on cheeks */}
        <circle cx="26" cy="46" r="1.5" fill="#93C5FD" opacity="0.4" />
        <circle cx="54" cy="46" r="1.5" fill="#93C5FD" opacity="0.4" />
        {/* Body suggestion */}
        <path d="M22 72 Q22 60 40 58 Q58 60 58 72" fill="#1D4ED8" opacity="0.9" />
        {/* Collar circuit */}
        <path d="M30 60 H36 V58 H44 V60 H50" stroke="#93C5FD" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: 2,
    name: "Chronos",
    tagline: "Career Focus · Learning Velocity",
    accent: "#10B981",
    bg: "linear-gradient(135deg, #052e16 0%, #064e3b 50%, #022c22 100%)",
    glow: "rgba(16,185,129,0.5)",
    ring: "#10B981",
    svg: (
      <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" width="64" height="64">
        <defs>
          <radialGradient id="ch-face" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#D1FAE5" />
            <stop offset="100%" stopColor="#6EE7B7" />
          </radialGradient>
          <radialGradient id="ch-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#065F46" stopOpacity="0" />
          </radialGradient>
          <filter id="ch-blur">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>
        <circle cx="40" cy="40" r="36" fill="url(#ch-glow)" filter="url(#ch-blur)" />
        {/* Head */}
        <ellipse cx="40" cy="38" rx="20" ry="22" fill="url(#ch-face)" />
        {/* Data arc crown */}
        <path d="M24 26 Q40 12 56 26" stroke="#34D399" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" />
        <circle cx="40" cy="13" r="2" fill="#34D399" opacity="0.8" />
        {/* Temple circuits */}
        <path d="M20 36 H14 V28 H18" stroke="#34D399" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.65" />
        <path d="M60 36 H66 V28 H62" stroke="#34D399" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.65" />
        {/* Eyes */}
        <ellipse cx="33" cy="37" rx="4.5" ry="4.5" fill="#059669" />
        <ellipse cx="47" cy="37" rx="4.5" ry="4.5" fill="#059669" />
        <ellipse cx="33" cy="37" rx="2.5" ry="2.5" fill="#ECFDF5" />
        <ellipse cx="47" cy="37" rx="2.5" ry="2.5" fill="#ECFDF5" />
        <circle cx="33" cy="37" r="1" fill="#065F46" />
        <circle cx="47" cy="37" r="1" fill="#065F46" />
        <circle cx="34" cy="35.8" r="0.8" fill="white" opacity="0.9" />
        <circle cx="48" cy="35.8" r="0.8" fill="white" opacity="0.9" />
        {/* Clock arc on forehead */}
        <path d="M34 28 Q40 25 46 28" stroke="#6EE7B7" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5" />
        {/* Mouth */}
        <path d="M35 51 Q40 56 45 51" stroke="#A7F3D0" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        {/* Cheek dots */}
        <circle cx="26" cy="45" r="1.5" fill="#6EE7B7" opacity="0.4" />
        <circle cx="54" cy="45" r="1.5" fill="#6EE7B7" opacity="0.4" />
        {/* Body */}
        <path d="M22 72 Q22 60 40 58 Q58 60 58 72" fill="#047857" opacity="0.9" />
        {/* Collar */}
        <path d="M30 60 H36 V58 H44 V60 H50" stroke="#6EE7B7" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: 3,
    name: "Apex",
    tagline: "Peak Performance · Multi-Domain",
    accent: "#8B5CF6",
    bg: "linear-gradient(135deg, #1e0a3c 0%, #2e1065 50%, #170627 100%)",
    glow: "rgba(139,92,246,0.55)",
    ring: "#8B5CF6",
    svg: (
      <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" width="64" height="64">
        <defs>
          <radialGradient id="ap-face" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#EDE9FE" />
            <stop offset="100%" stopColor="#C4B5FD" />
          </radialGradient>
          <radialGradient id="ap-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#4C1D95" stopOpacity="0" />
          </radialGradient>
          <filter id="ap-blur">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>
        <circle cx="40" cy="40" r="36" fill="url(#ap-glow)" filter="url(#ap-blur)" />
        {/* Head */}
        <ellipse cx="40" cy="38" rx="20" ry="22" fill="url(#ap-face)" />
        {/* Apex tri-crown */}
        <polygon points="40,8 44,17 36,17" fill="#A78BFA" opacity="0.85" />
        <polygon points="33,10 35,18 29,16" fill="#C4B5FD" opacity="0.6" />
        <polygon points="47,10 51,16 45,18" fill="#C4B5FD" opacity="0.6" />
        {/* Temple lines */}
        <path d="M20 38 H13 M13 38 L13 30" stroke="#A78BFA" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7" />
        <path d="M60 38 H67 M67 38 L67 30" stroke="#A78BFA" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7" />
        {/* Eyes */}
        <ellipse cx="33" cy="37" rx="4.5" ry="4.5" fill="#7C3AED" />
        <ellipse cx="47" cy="37" rx="4.5" ry="4.5" fill="#7C3AED" />
        <ellipse cx="33" cy="37" rx="2.5" ry="2.5" fill="#F5F3FF" />
        <ellipse cx="47" cy="37" rx="2.5" ry="2.5" fill="#F5F3FF" />
        <circle cx="33" cy="37" r="1" fill="#4C1D95" />
        <circle cx="47" cy="37" r="1" fill="#4C1D95" />
        <circle cx="34" cy="35.8" r="0.8" fill="white" opacity="0.9" />
        <circle cx="48" cy="35.8" r="0.8" fill="white" opacity="0.9" />
        {/* Star mark — cheek left */}
        <polygon points="26,46 27,43.5 28,46 30.5,46 28.5,47.5 29.5,50 27,48.5 24.5,50 25.5,47.5 23.5,46" fill="#DDD6FE" opacity="0.5" />
        {/* Mouth */}
        <path d="M35 51 Q40 56 45 51" stroke="#DDD6FE" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        {/* Body */}
        <path d="M22 72 Q22 60 40 58 Q58 60 58 72" fill="#6D28D9" opacity="0.9" />
        {/* Collar */}
        <path d="M30 60 H36 V58 H44 V60 H50" stroke="#C4B5FD" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: 4,
    name: "Nexus",
    tagline: "Wealth Management · Savings Runway",
    accent: "#F59E0B",
    bg: "linear-gradient(135deg, #1c1108 0%, #3d2000 50%, #1a0f00 100%)",
    glow: "rgba(245,158,11,0.5)",
    ring: "#F59E0B",
    svg: (
      <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" width="64" height="64">
        <defs>
          <radialGradient id="nx-face" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#FEF3C7" />
            <stop offset="100%" stopColor="#FCD34D" />
          </radialGradient>
          <radialGradient id="nx-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#78350F" stopOpacity="0" />
          </radialGradient>
          <filter id="nx-blur">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>
        <circle cx="40" cy="40" r="36" fill="url(#nx-glow)" filter="url(#nx-blur)" />
        {/* Head */}
        <ellipse cx="40" cy="38" rx="20" ry="22" fill="url(#nx-face)" />
        {/* Wealth crown — hexagonal */}
        <polygon points="40,10 44,14 44,20 40,24 36,20 36,14" fill="none" stroke="#FCD34D" strokeWidth="1.5" opacity="0.75" />
        <circle cx="40" cy="17" r="2" fill="#F59E0B" opacity="0.9" />
        {/* Temple circuits */}
        <path d="M20 36 H14 V44 H18" stroke="#FCD34D" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.65" />
        <path d="M60 36 H66 V44 H62" stroke="#FCD34D" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.65" />
        {/* Eyes */}
        <ellipse cx="33" cy="37" rx="4.5" ry="4.5" fill="#D97706" />
        <ellipse cx="47" cy="37" rx="4.5" ry="4.5" fill="#D97706" />
        <ellipse cx="33" cy="37" rx="2.5" ry="2.5" fill="#FFFBEB" />
        <ellipse cx="47" cy="37" rx="2.5" ry="2.5" fill="#FFFBEB" />
        <circle cx="33" cy="37" r="1" fill="#92400E" />
        <circle cx="47" cy="37" r="1" fill="#92400E" />
        <circle cx="34" cy="35.8" r="0.8" fill="white" opacity="0.9" />
        <circle cx="48" cy="35.8" r="0.8" fill="white" opacity="0.9" />
        {/* Diamond on forehead */}
        <polygon points="40,28 42,31 40,34 38,31" fill="#FDE68A" opacity="0.6" />
        {/* Mouth */}
        <path d="M35 51 Q40 56 45 51" stroke="#FDE68A" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        {/* Cheek dots */}
        <circle cx="26" cy="45" r="1.5" fill="#FCD34D" opacity="0.4" />
        <circle cx="54" cy="45" r="1.5" fill="#FCD34D" opacity="0.4" />
        {/* Body */}
        <path d="M22 72 Q22 60 40 58 Q58 60 58 72" fill="#B45309" opacity="0.9" />
        {/* Collar */}
        <path d="M30 60 H36 V58 H44 V60 H50" stroke="#FDE68A" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6" />
      </svg>
    ),
  },
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    avatarId: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // ── Frontend Validation ──────────────────────────────────────────────
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    const age = Number(formData.age);
    if (isNaN(age) || age < 13 || age > 120) {
      setError("Age must be between 13 and 120");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // ── CHANGED: Redirect to /onboarding instead of /dashboard ──────
      await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        callbackUrl: "/onboarding",
        redirect: true,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedAvatar = AVATAR_OPTIONS.find((a) => a.id === formData.avatarId)!;

  return (
    <div className="signup-page">
      <div className="signup-card">

        {/* ── Syntra Monogram ─────────────────────────────────────────── */}
        <div className="logo-mark">
          <div className="logo-circle">
            <SyntraMonogram />
          </div>
        </div>

        <h1 className="signup-title">Create Your Account</h1>
        <p className="signup-subtitle">
          Choose your AI twin identity and sync your digital self
        </p>

        {/* ── Premium Avatar Picker ────────────────────────────────────── */}
        <div className="avatar-section">
          <div className="section-label">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Select your AI twin
          </div>

          <div className="avatar-grid premium">
            {AVATAR_OPTIONS.map((avatar) => {
              const isSelected = formData.avatarId === avatar.id;
              return (
                <div
                  key={avatar.id}
                  onClick={() => setFormData({ ...formData, avatarId: avatar.id })}
                  className={`avatar-item premium-avatar ${isSelected ? "selected" : ""}`}
                  style={
                    {
                      "--avatar-accent": avatar.accent,
                      "--avatar-glow": avatar.glow,
                    } as React.CSSProperties
                  }
                >
                  {/* Glow ring */}
                  <div
                    className="avatar-glow-ring"
                    style={{
                      border: `1.5px solid ${avatar.ring}`,
                      boxShadow: isSelected
                        ? `0 0 18px 4px ${avatar.glow}, 0 0 6px 2px ${avatar.glow}`
                        : "none",
                    }}
                  />
                  {/* Avatar bubble */}
                  <div
                    className="avatar-bubble premium-bubble"
                    style={{ background: avatar.bg }}
                  >
                    {avatar.svg}
                    {isSelected && (
                      <span className="avatar-check premium-check">
                        <svg
                          width="9"
                          height="9"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <span className="avatar-label premium-label">{avatar.name}</span>
                  <span className="avatar-tagline">{avatar.tagline}</span>
                </div>
              );
            })}
          </div>

          {/* Selected avatar banner */}
          <div
            className="selected-avatar-banner"
            style={{ borderColor: selectedAvatar.accent }}
          >
            <div className="banner-avatar-mini" style={{ background: selectedAvatar.bg }}>
              {selectedAvatar.svg}
            </div>
            <div className="banner-text">
              <span className="banner-name" style={{ color: selectedAvatar.accent }}>
                {selectedAvatar.name}
              </span>
              <span className="banner-tagline">{selectedAvatar.tagline}</span>
            </div>
            <div
              className="banner-dot"
              style={{ background: selectedAvatar.accent }}
            />
          </div>
        </div>

        {/* ── Form ─────────────────────────────────────────────────────── */}
        <form onSubmit={handleRegister}>

          {/* Name */}
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <div className="input-wrap">
              <span className={`input-icon ${nameFocused ? "active" : ""}`}>
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                type="text"
                name="name"
                required
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                className="form-input"
              />
            </div>
          </div>

          {/* Email */}
          <div className="input-group">
            <label className="input-label">Email</label>
            <div className="input-wrap">
              <span className={`input-icon ${emailFocused ? "active" : ""}`}>
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                className="form-input"
              />
            </div>
          </div>

          {/* Password + Age row */}
          <div className="row-inputs">
            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="input-wrap">
                <span className={`input-icon ${passwordFocused ? "active" : ""}`}>
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  className="form-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              <p
                style={{
                  fontSize: "0.72rem",
                  color: "#6b7280",
                  marginTop: "6px",
                  lineHeight: "1.5",
                  paddingLeft: "2px",
                }}
              >
                Password must contain:
                <br />• 8+ characters
                <br />• 1 uppercase letter
                <br />• 1 number
                <br />• 1 special character
              </p>
            </div>

            <div className="input-group" style={{ maxWidth: "100px" }}>
              <label className="input-label">Age</label>
              <div className="input-wrap">
                <input
                  type="number"
                  name="age"
                  min="13"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                  className="form-input no-icon"
                  style={{ paddingLeft: "16px", paddingRight: "12px" }}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="error-box" style={{ marginTop: "1rem" }}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? (
              <span className="btn-content">
                <span className="spinner">
                  <span className="ring ring-outer" />
                  <span className="ring ring-inner" />
                  <span className="ring ring-dot" />
                </span>
                <span>Creating your account</span>
                <span className="loading-dots">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </span>
              </span>
            ) : (
              <span className="btn-content">Activate AI Twin →</span>
            )}
          </button>
        </form>

        <div className="trust-row">
          <span className="trust-badge">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Secure &amp; Private
          </span>
          <span className="trust-badge">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Free to Join
          </span>
          <span className="trust-badge">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            No Spam Ever
          </span>
        </div>

        <div className="bottom-text">
          Already have an account?{" "}
          <Link href="/login" className="login-link">
            Log in →
          </Link>
        </div>
      </div>
    </div>
  );
}