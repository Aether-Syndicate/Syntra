//src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // This calls your [...nextauth]/route.ts file behind the scenes!
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError('Invalid email or password');
    } else {
      // If successful, send them to the Twin Dashboard!
      router.push('/dashboard');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-zinc-900 p-10 shadow-2xl border border-zinc-800">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight">Syntra</h2>
          <p className="mt-2 text-zinc-400">Sign in to your Digital Twin</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 mt-8">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md bg-zinc-800 p-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md bg-zinc-800 p-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-white py-3 font-semibold text-black hover:bg-zinc-200 transition-colors"
          >
            Access Terminal
          </button>
        </form>
      </div>
    </main>
  );
}