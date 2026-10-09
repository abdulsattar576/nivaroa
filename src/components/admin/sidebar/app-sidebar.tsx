import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import AdminSidebarNav from "./admin-sidebar-nav";
import Link from "next/link";
import Image from "next/image";
import { Images } from "@/constant/Image";

export function AppSidebar() {
  const { logo } = Images;

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-[#e6ece4] p-4">
        <Link href="/admin" className="flex items-center gap-3" aria-label="Nivaroa Admin">
          <div className="grid size-10 place-items-center rounded-xl bg-[#edf3ea] p-1 shadow-xs ring-1 ring-[#d4e2d3]">
            <Image src={logo} alt="Nivaroa" width={32} height={32} className="size-7 object-contain" />
          </div>
          <div>
            <span className="text-sm font-semibold tracking-[0.14em] text-[#193225]">NIVAROA</span>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#63796a]">Admin Portal</p>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-[#798a7e]">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <AdminSidebarNav />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-[#e6ece4] p-3 text-xs text-[#63796a]">
        Admin Dashboard
      </SidebarFooter>
    </Sidebar>
  );
}