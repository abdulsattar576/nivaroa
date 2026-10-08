 import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar'
import React from 'react'
import { Nav_data } from './data'
import Link from 'next/link'
 
import { ChevronRight } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
 
 
 const AdminSidebarNav = () => {
   return (
      <SidebarMenu>
        {
          Nav_data.map((item)=>{
            const Icon=item.icon
            if(item.type === "link")
            {
              return(
<SidebarMenuItem key={item.id}>
  <SidebarMenuButton render={<Link href={item.links.href}/>}>
  <Icon/>
<span>{item.links.name}</span>
  </SidebarMenuButton>
</SidebarMenuItem>

            )
            
            }
          else {
  return (
    <Collapsible  key={item.name}>
      <SidebarMenuItem>

        <CollapsibleTrigger
          render={<SidebarMenuButton />}
        >
          <Icon />
          <span>{item.name}</span>
          <ChevronRight className="ml-auto" />
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>

            {item.links.map((link) => (
              <SidebarMenuSubItem key={link.id}>

                <SidebarMenuSubButton
                  render={<Link href={link.href} />}
                >
                  <span>{link.name}</span>
                </SidebarMenuSubButton>

              </SidebarMenuSubItem>
            ))}

          </SidebarMenuSub>
        </CollapsibleContent>

      </SidebarMenuItem>
    </Collapsible>
  );
}
          })
        
        }
      </SidebarMenu>
   )
 }
 
 export default AdminSidebarNav