"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import "./signup.css";

// Cartoon SVG avatars — WhatsApp/Bitmoji style illustrated characters
const AVATAR_OPTIONS = [
  {
    id: 1,
    name: "Cool Guy",
    bg: "#DBEAFE",
    svg: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="64" height="64">
        {/* Body */}
        <circle cx="50" cy="75" r="28" fill="#1D4ED8"/>
        {/* Head */}
        <circle cx="50" cy="38" r="22" fill="#FBBF24"/>
        {/* Hair */}
        <ellipse cx="50" cy="18" rx="18" ry="8" fill="#1e293b"/>
        <rect x="32" y="16" width="36" height="10" rx="5" fill="#1e293b"/>
        {/* Sunglasses */}
        <rect x="33" y="36" width="13" height="9" rx="4" fill="#1e293b"/>
        <rect x="54" y="36" width="13" height="9" rx="4" fill="#1e293b"/>
        <line x1="46" y1="40" x2="54" y2="40" stroke="#1e293b" strokeWidth="2"/>
        {/* Smile */}
        <path d="M42 50 Q50 58 58 50" stroke="#92400e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* Ears */}
        <circle cx="28" cy="40" r="5" fill="#FBBF24"/>
        <circle cx="72" cy="40" r="5" fill="#FBBF24"/>
      </svg>
    ),
  },
  {
    id: 2,
    name: "Happy Girl",
    bg: "#FCE7F3",
    svg: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="64" height="64">
        {/* Body */}
        <circle cx="50" cy="75" r="28" fill="#EC4899"/>
        {/* Head */}
        <circle cx="50" cy="38" r="22" fill="#FDE68A"/>
        {/* Hair - long */}
        <ellipse cx="50" cy="18" rx="20" ry="9" fill="#7C3AED"/>
        <rect x="28" y="18" width="10" height="30" rx="5" fill="#7C3AED"/>
        <rect x="62" y="18" width="10" height="30" rx="5" fill="#7C3AED"/>
        <rect x="30" y="14" width="40" height="12" rx="6" fill="#7C3AED"/>
        {/* Eyes */}
        <circle cx="41" cy="38" r="4" fill="#1e293b"/>
        <circle cx="59" cy="38" r="4" fill="#1e293b"/>
        <circle cx="43" cy="36" r="1.5" fill="white"/>
        <circle cx="61" cy="36" r="1.5" fill="white"/>
        {/* Rosy cheeks */}
        <circle cx="35" cy="46" r="5" fill="#FCA5A5" opacity="0.6"/>
        <circle cx="65" cy="46" r="5" fill="#FCA5A5" opacity="0.6"/>
        {/* Big smile */}
        <path d="M40 49 Q50 60 60 49" stroke="#92400e" strokeWidth="2.5" fill="#FCA5A5" strokeLinecap="round"/>
        {/* Ears */}
        <circle cx="28" cy="40" r="5" fill="#FDE68A"/>
        <circle cx="72" cy="40" r="5" fill="#FDE68A"/>
      </svg>
    ),
  },
  {
    id: 3,
    name: "Tech Wizard",
    bg: "#D1FAE5",
    svg: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="64" height="64">
        {/* Body */}
        <circle cx="50" cy="75" r="28" fill="#059669"/>
        {/* Head */}
        <circle cx="50" cy="38" r="22" fill="#FDBA74"/>
        {/* Hair spiky */}
        <ellipse cx="50" cy="17" rx="16" ry="7" fill="#dc2626"/>
        <polygon points="36,18 32,4 40,14" fill="#dc2626"/>
        <polygon points="50,16 48,2 54,14" fill="#dc2626"/>
        <polygon points="64,18 68,4 60,14" fill="#dc2626"/>
        {/* Glasses - round nerdy */}
        <circle cx="41" cy="38" r="7" fill="none" stroke="#1e293b" strokeWidth="2.5"/>
        <circle cx="59" cy="38" r="7" fill="none" stroke="#1e293b" strokeWidth="2.5"/>
        <line x1="48" y1="38" x2="52" y2="38" stroke="#1e293b" strokeWidth="2"/>
        <line x1="27" y1="35" x2="34" y2="37" stroke="#1e293b" strokeWidth="2"/>
        <line x1="66" y1="37" x2="73" y2="35" stroke="#1e293b" strokeWidth="2"/>
        {/* Eyes behind glasses */}
        <circle cx="41" cy="38" r="3" fill="#1e293b"/>
        <circle cx="59" cy="38" r="3" fill="#1e293b"/>
        {/* Smile */}
        <path d="M42 50 Q50 57 58 50" stroke="#92400e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* Ears */}
        <circle cx="28" cy="40" r="5" fill="#FDBA74"/>
        <circle cx="72" cy="40" r="5" fill="#FDBA74"/>
      </svg>
    ),
  },
  {
    id: 4,
    name: "Explorer",
    bg: "#FEF3C7",
    svg: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="64" height="64">
        {/* Body */}
        <circle cx="50" cy="75" r="28" fill="#D97706"/>
        {/* Head */}
        <circle cx="50" cy="38" r="22" fill="#FCD34D"/>
        {/* Hat */}
        <rect x="30" y="18" width="40" height="6" rx="3" fill="#92400e"/>
        <ellipse cx="50" cy="16" rx="22" ry="5" fill="#92400e"/>
        <rect x="36" y="10" width="28" height="12" rx="4" fill="#B45309"/>
        {/* Eyes */}
        <circle cx="41" cy="39" r="4.5" fill="white"/>
        <circle cx="59" cy="39" r="4.5" fill="white"/>
        <circle cx="42" cy="39" r="2.5" fill="#1e293b"/>
        <circle cx="60" cy="39" r="2.5" fill="#1e293b"/>
        <circle cx="43" cy="37.5" r="1" fill="white"/>
        <circle cx="61" cy="37.5" r="1" fill="white"/>
        {/* Freckles */}
        <circle cx="37" cy="46" r="1.5" fill="#B45309" opacity="0.5"/>
        <circle cx="40" cy="48" r="1.5" fill="#B45309" opacity="0.5"/>
        <circle cx="60" cy="48" r="1.5" fill="#B45309" opacity="0.5"/>
        <circle cx="63" cy="46" r="1.5" fill="#B45309" opacity="0.5"/>
        {/* Smile */}
        <path d="M41 50 Q50 59 59 50" stroke="#92400e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* Ears */}
        <circle cx="28" cy="40" r="5" fill="#FCD34D"/>
        <circle cx="72" cy="40" r="5" fill="#FCD34D"/>
      </svg>
    ),
  },
  {
    id: 5,
    name: "Star Artist",
    bg: "#EDE9FE",
    svg: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="64" height="64">
        {/* Body */}
        <circle cx="50" cy="75" r="28" fill="#7C3AED"/>
        {/* Head */}
        <circle cx="50" cy="38" r="22" fill="#FECACA"/>
        {/* Curly hair */}
        <circle cx="34" cy="22" r="9" fill="#0f172a"/>
        <circle cx="50" cy="18" r="10" fill="#0f172a"/>
        <circle cx="66" cy="22" r="9" fill="#0f172a"/>
        <circle cx="28" cy="32" r="7" fill="#0f172a"/>
        <circle cx="72" cy="32" r="7" fill="#0f172a"/>
        {/* Star on cheek */}
        <text x="33" y="49" fontSize="9" fill="#F59E0B">★</text>
        {/* Eyes with lashes */}
        <ellipse cx="41" cy="38" rx="4" ry="4.5" fill="#1e293b"/>
        <ellipse cx="59" cy="38" rx="4" ry="4.5" fill="#1e293b"/>
        <circle cx="42.5" cy="36.5" r="1.5" fill="white"/>
        <circle cx="60.5" cy="36.5" r="1.5" fill="white"/>
        {/* Lashes */}
        <line x1="38" y1="34" x2="36" y2="31" stroke="#1e293b" strokeWidth="1.5"/>
        <line x1="41" y1="33" x2="41" y2="30" stroke="#1e293b" strokeWidth="1.5"/>
        <line x1="44" y1="34" x2="46" y2="31" stroke="#1e293b" strokeWidth="1.5"/>
        <line x1="56" y1="34" x2="54" y2="31" stroke="#1e293b" strokeWidth="1.5"/>
        <line x1="59" y1="33" x2="59" y2="30" stroke="#1e293b" strokeWidth="1.5"/>
        <line x1="62" y1="34" x2="64" y2="31" stroke="#1e293b" strokeWidth="1.5"/>
        {/* Smile */}
        <path d="M41 50 Q50 59 59 50" stroke="#991b1b" strokeWidth="2.5" fill="#FCA5A5" strokeLinecap="round"/>
        {/* Ears */}
        <circle cx="28" cy="40" r="5" fill="#FECACA"/>
        <circle cx="72" cy="40" r="5" fill="#FECACA"/>
      </svg>
    ),
  },
  {
    id: 6,
    name: "Sport Champ",
    bg: "#DCFCE7",
    svg: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="64" height="64">
        {/* Body */}
        <circle cx="50" cy="75" r="28" fill="#16A34A"/>
        {/* Sweatband */}
        <rect x="30" y="22" width="40" height="8" rx="4" fill="#EF4444"/>
        {/* Head */}
        <circle cx="50" cy="38" r="22" fill="#D1FAE5"/>
        {/* Hair above band */}
        <rect x="32" y="14" width="36" height="12" rx="6" fill="#1e293b"/>
        {/* Determined eyes */}
        <ellipse cx="41" cy="38" rx="5" ry="4" fill="white"/>
        <ellipse cx="59" cy="38" rx="5" ry="4" fill="white"/>
        <circle cx="42" cy="38" r="3" fill="#1e293b"/>
        <circle cx="60" cy="38" r="3" fill="#1e293b"/>
        <circle cx="43" cy="36.5" r="1" fill="white"/>
        <circle cx="61" cy="36.5" r="1" fill="white"/>
        {/* Eyebrows - determined */}
        <path d="M36 33 Q41 30 46 33" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M54 33 Q59 30 64 33" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* Confident smirk */}
        <path d="M43 50 Q52 57 58 50" stroke="#065f46" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* Ears */}
        <circle cx="28" cy="40" r="5" fill="#D1FAE5"/>
        <circle cx="72" cy="40" r="5" fill="#D1FAE5"/>
      </svg>
    ),
  },
];

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

  // FRONTEND VALIDATION

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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      callbackUrl: "/dashboard",
      redirect: true,
    });

  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  const selectedAvatar = AVATAR_OPTIONS.find((a) => a.id === formData.avatarId);

  return (
    <div className="signup-page">
      

      <div className="signup-card">

        {/* Logo */}
        <div className="logo-mark">
          <div className="logo-circle">
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
              <path d="M6 14C6 9.58 9.58 6 14 6C16.2 6 18.2 6.9 19.66 8.34L22 6C19.93 4.12 17.1 3 14 3C7.92 3 3 7.92 3 14C3 20.08 7.92 25 14 25C20.08 25 25 20.08 25 14H22C22 18.42 18.42 22 14 22C9.58 22 6 18.42 6 14Z" fill="white" fillOpacity="0.85"/>
              <circle cx="20" cy="8" r="4" fill="white"/>
            </svg>
          </div>
        </div>

        <h1 className="signup-title">Create Your Account</h1>
        <p className="signup-subtitle">Pick an avatar and fill in your details to get started</p>

        {/* Avatar Picker */}
        <div className="avatar-section">
          <div className="section-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0055EE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            Choose your avatar
          </div>

          <div className="avatar-grid">
            {AVATAR_OPTIONS.map((avatar) => (
              <div
                key={avatar.id}
                onClick={() => setFormData({ ...formData, avatarId: avatar.id })}
                className={`avatar-item ${formData.avatarId === avatar.id ? "selected" : ""}`}
              >
                <div className="avatar-bubble" style={{ background: avatar.bg }}>
                  {avatar.svg}
                  <span className="avatar-check">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </span>
                </div>
                <span className="avatar-label">{avatar.name}</span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleRegister}>

          {/* Name */}
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <div className="input-wrap">
              <span className={`input-icon ${nameFocused ? "active" : ""}`}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
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
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
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
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
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
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
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
  <br />
  • 8+ characters
  <br />
  • 1 uppercase letter
  <br />
  • 1 number
  <br />
  • 1 special character
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? (
              <span className="btn-content">
                <span className="spinner">
                  <span className="ring ring-outer"/>
                  <span className="ring ring-inner"/>
                  <span className="ring ring-dot"/>
                </span>
                <span>Creating your account</span>
                <span className="loading-dots">
                  <span className="dot"/><span className="dot"/><span className="dot"/>
                </span>
              </span>
            ) : (
              <span className="btn-content">Create Account →</span>
            )}
          </button>
        </form>

        <div className="trust-row">
          <span className="trust-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Secure & Private
          </span>
          <span className="trust-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Free to Join
          </span>
          <span className="trust-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            No Spam Ever
          </span>
        </div>

        <div className="bottom-text">
          Already have an account?{" "}
          <Link href="/login" className="login-link">Log in →</Link>
        </div>
      </div>
    </div>
  );
}