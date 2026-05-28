"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Loader2, Mail } from "lucide-react"

const ADMIN_LOGIN_BASE_URL =
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/app/auth/admin/login`

export default function LoginForm() {

  // console.log("BASE URL 👉", process.env.NEXT_PUBLIC_API_BASE_URL) // 👈 HERE



  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const normalizedEmail = email.trim().toLowerCase()
      // const response = await fetch(
      //   `${ADMIN_LOGIN_BASE_URL}/${encodeURIComponent(normalizedEmail)}`,
      //   { method: "GET" },
      // )


      const response = await fetch(
  `${ADMIN_LOGIN_BASE_URL}?email=${encodeURIComponent(normalizedEmail)}`,
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }
)

      let result: { message?: string } | null = null
      try {
        result = await response.json()
      } catch {
        result = null
      }

      if (!response.ok) {
        throw new Error(result?.message || "Failed to send OTP")
      }

localStorage.removeItem("cms_token")

      localStorage.setItem("admin_login_email", normalizedEmail)
      router.push("/verify-otp")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm rounded-2xl bg-white/90 bg-gradient-to-br from-gray-100 to-blue-200 p-6 shadow-xl backdrop-blur"
      >
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Blog CMS</h1>
            <p className="text-xs text-gray-500">Admin Login</p>
          </div>
        </div>

        <p className="mb-6 text-sm text-gray-600">
          Enter the admin email address to receive a login OTP.
        </p>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mb-5">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@blog.com"
            className="w-full rounded-lg border px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-black py-2.5 text-sm font-medium text-white transition hover:bg-gray-900 disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending OTP
            </>
          ) : (
            <>
              Send OTP
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <p className="mt-5 text-center text-xs text-gray-400">
          We&apos;ll open the OTP verification step next
        </p>
      </form>
    </div>
  )
}
