import { AppSidebar } from '@/components/admin/sidebar/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AdminProxy } from '@/lib/proxy'
import React from 'react'

const AdminLayout = async ({children}:{children:React.ReactNode}) => {
  await AdminProxy()

  return (
    <SidebarProvider>
        <AppSidebar/>
        <main className='flex-1'>
            <SidebarTrigger />
            {children}
        </main>
    </SidebarProvider>
   )
}

export default AdminLayout