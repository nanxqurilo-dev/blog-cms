// "use client"

// import Link from "next/link"
// import {
//   LayoutDashboard,
//   FileText,
//   Layers,
//   FolderTree,
//   Image,
//   MessageSquare,
//   Search,
//   BarChart,
//   Users,
//   Shield,
//   Zap,
//   Plug,
//   Settings,
//   LogOut,
// } from "lucide-react"

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarGroupLabel,
//   SidebarGroupContent,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarMenuButton,
//   SidebarHeader,
// } from "@/components/ui/sidebar"

// export function AppSidebar() {
//   return (
//     <Sidebar className="w-72">
//       {/* HEADER */}
//       <SidebarHeader className="border-b px-4 py-3">
//         <h2 className="text-lg font-bold">Next CMS</h2>
//         <p className="text-xs text-muted-foreground">
//           Elementor-style CMS
//         </p>
//       </SidebarHeader>

//       <SidebarContent>

//         {/* CORE */}
//         <SidebarGroup>
//           <SidebarGroupLabel>Core</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               <Item href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>

//         {/* CONTENT */}
//         <SidebarGroup>
//           <SidebarGroupLabel>Content</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               <Item href="/posts" icon={FileText} label="Posts" />
//               <Item href="/pages" icon={FolderTree} label="Pages" />
//               <Item href="/drafts" icon={FileText} label="Drafts" />
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>

//         {/* BUILDER */}
//         <SidebarGroup>
//           <SidebarGroupLabel>Builder</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               <Item href="/builder" icon={Layers} label="Page Builder" />
//               <Item href="/templates" icon={Layers} label="Templates" />
//               <Item href="/theme-builder" icon={Layers} label="Theme Builder" />
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>

//         {/* TAXONOMY */}
//         <SidebarGroup>
//           <SidebarGroupLabel>Taxonomy</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               <Item href="/categories" icon={FolderTree} label="Categories" />
//               <Item href="/tags" icon={FolderTree} label="Tags" />
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>

//         {/* MEDIA */}
//         <SidebarGroup>
//           <SidebarGroupLabel>Media</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               <Item href="/media" icon={Image} label="Media Library" />
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>

//         {/* ENGAGEMENT */}
//         <SidebarGroup>
//           <SidebarGroupLabel>Engagement</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               <Item href="/comments" icon={MessageSquare} label="Comments" />
//               <Item href="/leads" icon={Users} label="Leads" />
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>

//         {/* SEO */}
//         <SidebarGroup>
//           <SidebarGroupLabel>SEO & Marketing</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               <Item href="/seo" icon={Search} label="SEO Manager" />
//               <Item href="/redirects" icon={Search} label="Redirects" />
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>

//         {/* ANALYTICS */}
//         <SidebarGroup>
//           <SidebarGroupLabel>Analytics</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               <Item href="/analytics" icon={BarChart} label="Analytics" />
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>

//         {/* USERS */}
//         <SidebarGroup>
//           <SidebarGroupLabel>Users & Access</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               <Item href="/users" icon={Users} label="Users" />
//               <Item href="/roles" icon={Shield} label="Roles & Permissions" />
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>

//         {/* PERFORMANCE */}
//         <SidebarGroup>
//           <SidebarGroupLabel>Performance</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               <Item href="/cache" icon={Zap} label="Cache" />
//               <Item href="/optimization" icon={Zap} label="Optimization" />
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>

//         {/* INTEGRATIONS */}
//         <SidebarGroup>
//           <SidebarGroupLabel>Integrations</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               <Item href="/integrations" icon={Plug} label="Integrations" />
//               <Item href="/webhooks" icon={Plug} label="Webhooks" />
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>

//       {/* FOOTER */}
//       <SidebarFooter className="border-t p-3">
//         <SidebarMenu>
//           <Item href="/settings" icon={Settings} label="Settings" />
//           <SidebarMenuItem>
//             <SidebarMenuButton className="text-red-500">
//               <LogOut className="mr-2 h-4 w-4" />
//               Logout
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarFooter>
//     </Sidebar>
//   )
// }

// /* 🔁 Reusable Item */
// function Item({
//   href,
//   icon: Icon,
//   label,
// }: {
//   href: string
//   icon: any
//   label: string
// }) {
//   return (
//     <SidebarMenuItem>
//       <SidebarMenuButton asChild>
//         <Link href={href}>
//           <Icon className="mr-2 h-4 w-4" />
//           {label}
//         </Link>
//       </SidebarMenuButton>
//     </SidebarMenuItem>
//   )
// }





"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Edit3,
  PlusSquare,
  Layers,
  MessageSquare,
  Search,
  Settings,
  ChevronDown,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "@/components/ui/sidebar"

import { useState } from "react"
import clsx from "clsx"

export function AppSidebar() {
  const pathname = usePathname()

  const [contentOpen, setContentOpen] = useState(true)
  const [editorOpen, setEditorOpen] = useState(true)

  return (
    <Sidebar className="w-72 border-none  text-blue-400">
      {/* LOGO */}
      <SidebarHeader className="py-8 text-center bg-gradient-to-b from-[#0a2a4f] via-[#0b3f78] to-[#082241]
 ">
        <h1 className="text-2xl font-bold o tracking-wide">LOGO</h1>
      </SidebarHeader>

      <SidebarContent className="px-3 space-y-2 bg-gradient-to-b from-[#0a2a4f] via-[#0b3f78] to-[#082241]
">

        {/* DASHBOARD */}
        <MenuItem 
          href="/dashboard"
          icon={LayoutDashboard}
          label="Dashboard"
          active={pathname === "/dashboard"}
        />

        {/* CONTENT */}
        <Section
          title="Content"
          open={contentOpen}
          onToggle={() => setContentOpen(!contentOpen)}
        >
          <MenuItem
            href="/posts"
            icon={FileText}
            label="Posts"
            active={pathname === "/posts"}
          />
          <MenuItem
            href="/pages"
            icon={FolderTree}
            label="Pages"
            active={pathname === "/pages"}
          />
          <MenuItem
            href="/drafts"
            icon={FileText}
            label="Drafts"
            active={pathname === "/drafts"}
          />
        </Section>

        {/* EDITOR */}
        <Section
          title="Editor"
          open={editorOpen}
          onToggle={() => setEditorOpen(!editorOpen)}
        >
          {/* <MenuItem
            href="/editor"
            icon={Edit3}
            label="Editor"
            active={pathname === "/editor"}
          /> */}
          <MenuItem
            href="/builder"
            icon={PlusSquare}
            label="Create"
            active={pathname === "/builder"}
          />
          <MenuItem
            href="/templates"
            icon={Layers}
            label="Templates"
            active={pathname === "/templates"}
          />
        </Section>

        {/* ENGAGEMENT */}
        <MenuItem
          href="/engagement"
          icon={MessageSquare}
          label="Engagement"
          active={pathname === "/engagement"}
        />

        {/* SEO */}
        <MenuItem
          href="/seo"
          icon={Search}
          label="SEO"
          active={pathname === "/seo"}
        />

        {/* SETTINGS */}
        <MenuItem
          href="/settings"
          icon={Settings}
          label="Settings"
          active={pathname === "/settings"}
        />
      </SidebarContent>

      <SidebarFooter className="h-10 bg-gradient-to-b from-[#0a2a4f] via-[#0b3f78] to-[#082241]
" />
    </Sidebar>
  )
}

/* ---------- COMPONENTS ---------- */

function MenuItem({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string
  icon: any
  label: string
  active?: boolean
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link
            href={href}
            className={clsx(
              "flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition",
              active
                ? "bg-[#dbe7ff] text-[#0b3c6d] font-medium"
                : "text-white/80 hover:bg-white/10"
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function Section({
  title,
  open,
  onToggle,
  children,
}: {
  title: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-2 text-sm text-white/70 hover:text-white"
      >
        {title}
        <ChevronDown
          size={16}
          className={clsx(
            "transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && <div className="mt-1 space-y-1">{children}</div>}
    </div>
  )
}
