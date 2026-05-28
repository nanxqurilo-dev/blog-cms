
"use client"

import { Bell, User } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { io } from "socket.io-client"

// ── Types ──────────────────────────────────────────────────────────────────
interface Notification {
  message: string
  createdAt: string
  type?: string
}


const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ── Socket instance ────────────────────────────────────────────────────────
// const socket = io("https://w7xqb95q-3000.inc1.devtunnels.ms", {
//   autoConnect: true,
//   reconnection: true,
// })



const socket = io(BASE_URL as string, {
  autoConnect: true,
  reconnection: true,
});



// ── Token decode ───────────────────────────────────────────────────────────
function decodeToken(token: string) {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    )
    return JSON.parse(jsonPayload)
  } catch (err) {
    console.error("Invalid token", err)
    return null
  }
}

// ── Helper ─────────────────────────────────────────────────────────────────
function getTitleFromPath(pathname: string) {
  if (pathname === "/") return "Dashboard"
  const segments = pathname.split("/").filter(Boolean)
  const lastSegment = segments[segments.length - 1]
  return lastSegment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

// ── Component ──────────────────────────────────────────────────────────────
export function DashboardHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const title = getTitleFromPath(pathname)

  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  // ── Decode token ──────────────────────────────────────────────────────
  // useEffect(() => {
  //   const token =
  //     typeof window !== "undefined"
  //       ? localStorage.getItem("cms_token")
  //       : null

  //   if (token) {
  //     const decoded = decodeToken(token)
  //     console.log("DECODED USER:", decoded)
  //     setUser(decoded)
  //   }
  // }, [])




useEffect(() => {
  loadProfile()

  // ✅ listen for profile updates
  window.addEventListener("profileUpdated", loadProfile)

  return () => {
    window.removeEventListener("profileUpdated", loadProfile)
  }
}, [])

const loadProfile = () => {
  const stored = localStorage.getItem("admin_profile")

  if (stored) {
    setUser(JSON.parse(stored))
  }
}



  // ── Socket listeners ──────────────────────────────────────────────────
  useEffect(() => {
    socket.on("connect", () => {
      console.log(":white_check_mark: Socket connected:", socket.id)
    })

    socket.on("disconnect", () => {
      console.log(":x: Socket disconnected")
    })

    socket.on("new_notification", (data: Notification) => {
      console.log(":fire: New Notification:", data)
      setNotifications((prev) => [data, ...prev])
      setUnreadCount((prev) => prev + 1)
    })

    return () => {
      socket.off("connect")
      socket.off("disconnect")
      socket.off("new_notification")
    }
  }, [])

  // ── Mark as read when dropdown opens ─────────────────────────────────
  const handleNotificationOpen = (open: boolean) => {
    setIsOpen(open)
    if (open) setUnreadCount(0)
  }

  // ── Logout ────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("cms_token")
        : null

    if (!token) {
      router.push("/")
      return
    }

    try {
      await fetch(
  `${BASE_URL}/app/auth/admin/logout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      localStorage.removeItem("cms_token")
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
      localStorage.removeItem("cms_token")
      router.push("/")
    }
  }

  return (
    <header className="flex items-center justify-between h-14 px-4 pl-8 border-b bg-background">

      {/* Left */}
      <div className="flex items-center gap-3 flex-1">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4 ml-auto">
        {/* :bell: Notification */}
        <DropdownMenu onOpenChange={handleNotificationOpen} open={isOpen}>
          {/*           <DropdownMenuTrigger asChild>
            <button className="relative p-2 rounded-full hover:bg-muted">
              <Bell size={18} />
              {unreadCount > 0 ? (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              ) : (
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
              )}
            </button>
          </DropdownMenuTrigger> */}




          <DropdownMenuTrigger>
            <button className="relative p-2 rounded-full hover:bg-muted">
              <Bell size={18} />
              {unreadCount > 0 ? (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              ) : (
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
              )}
            </button>
          </DropdownMenuTrigger>




          <DropdownMenuContent align="end" className="w-72 max-h-80 overflow-y-auto">

            <p className="px-3 py-2 text-xs font-semibold text-muted-foreground border-b">
              Notifications
            </p>

            {notifications.length === 0 ? (
              <p className="px-3 py-4 text-sm text-muted-foreground text-center">
                No notifications yet
              </p>
            ) : (
              notifications.map((notif, index) => (
                <DropdownMenuItem
                  key={index}
                  className="flex flex-col items-start px-3 py-2 gap-1"
                >
                  <span className="text-sm font-medium">{notif.message}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </DropdownMenuItem>
              ))
            )}

            {/* Clear all */}
            {notifications.length > 0 && (
              <div className="border-t px-3 py-2">
                <button
                  onClick={() => setNotifications([])}
                  className="text-xs text-red-500 hover:underline w-full text-center"
                >
                  Clear all
                </button>
              </div>
            )}

          </DropdownMenuContent>
        </DropdownMenu>

        {/* :bust_in_silhouette: Profile */}
        <DropdownMenu>
          {/*           <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-2 rounded-full hover:bg-muted">
              {user?.profile_Image ? (
                <img
                  src={user.profile_Image}
                  alt="profile"
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <User size={18} />
              )}
              <span className="text-sm">
                {user?.username || user?.email || "User"}
              </span>
            </button>
          </DropdownMenuTrigger> */}


          <DropdownMenuTrigger>
            <button className="flex items-center gap-2 p-2 rounded-full hover:bg-muted">
              {user?.profile_Image ? (
                <img
                  src={user.profile_Image}
                  alt="profile"
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <User size={18} />
              )}
              <span className="text-sm">
                {user?.username || user?.email || "User"}
              </span>
            </button>
          </DropdownMenuTrigger>



          <DropdownMenuContent align="end">
            <Link href="/settings">
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-500 cursor-pointer"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  )
}