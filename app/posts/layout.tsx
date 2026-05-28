

import type { Metadata } from "next"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"

export const metadata: Metadata = {
  title: "Posts",
  description: "Admin Posts Dashboard",
}

export default function PostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            {/* Sidebar */}
            <AppSidebar />

            {/* Right Content */}
            <div className="flex flex-col flex-1">
              {/* Top Header */}
              <DashboardHeader />

              {/* Page Content */}
              <main className="flex-1 p-6 bg-muted/40">
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}
