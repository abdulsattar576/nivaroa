 
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import AdminSidebarNav from "./admin-sidebar-nav";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

 

export function AppSidebar() {
  return (
<Sidebar>
    <SidebarHeader>Nivaroa</SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>
      Navigation
        </SidebarGroupLabel>
        <SidebarGroupContent>
       <AdminSidebarNav/>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
     <SidebarFooter>Admin Dashboard</SidebarFooter>
</Sidebar>
  )
}