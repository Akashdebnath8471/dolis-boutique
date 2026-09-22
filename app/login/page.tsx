'use client'

import { FormEvent, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError('')
    setLoading(true)

    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Email অথবা password ভুল হয়েছে।')
      setLoading(false)
      return
    }

    window.location.href = '/admin'
  }

  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-7 sm:p-9">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🧵</div>

            <h1 className="text-2xl font-bold text-gray-900">
              Doli&apos;s Boutique
            </h1>

            <p className="text-gray-500 mt-2">
              Admin Login
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Admin email"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white font-semibold py-3.5 transition"
            >
              {loading ? 'Login হচ্ছে...' : 'Login'}
            </button>

          </form>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 mt-7">
            Doli&apos;s Boutique • Pirojpur, Bongaon
          </p>

        </div>
      </div>
    </main>
  )
}