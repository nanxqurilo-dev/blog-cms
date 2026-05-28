"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react"

const ADMIN_VERIFY_OTP_URL =
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/app/auth/admin/verify-otp`

type VerifyOtpResponse = {
  message?: string
  token?: string
  admin?: {
    adminId?: string
    email?: string
    role?: string
  }
}

export default function VerifyOtpForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const savedEmail = localStorage.getItem("admin_login_email")

    if (!savedEmail) {
      router.replace("/")
      return
    }

    setEmail(savedEmail)
  }, [router])

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch(ADMIN_VERIFY_OTP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      })

      let result: VerifyOtpResponse | null = null
      try {
        result = await response.json()
      } catch {
        result = null
      }

      if (!response.ok || !result?.token) {
        throw new Error(result?.message || "Failed to verify OTP")
      }

      localStorage.setItem("cms_token", result.token)
      localStorage.setItem("cms_user", JSON.stringify(result.admin ?? {}))
      localStorage.removeItem("admin_login_email")
      router.replace("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      <form
        onSubmit={handleVerifyOtp}
        className="w-full max-w-sm rounded-2xl bg-white/90 bg-gradient-to-br from-gray-100 to-blue-200 p-6 shadow-xl backdrop-blur"
      >
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Verify OTP</h1>
            <p className="text-xs text-gray-500">Admin Login</p>
          </div>
        </div>

        <p className="mb-2 text-sm text-gray-600">
          Enter the OTP sent to your admin email.
        </p>

        {email && (
          <p className="mb-6 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
            {email}
          </p>
        )}

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mb-5">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            OTP
          </label>
          <input
            type="text"
            inputMode="numeric"
            required
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter 6 digit OTP"
            className="w-full rounded-lg border px-3 py-2 text-sm tracking-[0.35em] focus:border-black focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !email}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-black py-2.5 text-sm font-medium text-white transition hover:bg-gray-900 disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying OTP
            </>
          ) : (
            <>
              Verify OTP
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <p className="mt-5 text-center text-xs text-gray-400">
          Successful verification will open the dashboard
        </p>
      </form>
    </div>
  )
}
