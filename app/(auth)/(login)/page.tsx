"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import LoginForm from "@/components/auth/LoginForm"

export default function LoginPage() {
  const router = useRouter()

  // useEffect(() => {
  //   const token = localStorage.getItem("cms_token")

  //   if (token) {
  //     router.replace("/dashboard")
  //   }
  // }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-200">
      <LoginForm />
    </div>
  )
}
