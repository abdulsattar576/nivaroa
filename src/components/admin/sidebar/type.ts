import { LucideIcon } from "lucide-react";

export type nav_item={
    id:number,
    name:string;
    href:string;


}
export type sidebar_links={
    type:"link",
    id:number;
    icon:LucideIcon;
    links:nav_item
}

export type sidebar_dropdown={
    type:"dropdown";
    name:string;
    icon:LucideIcon
    links:nav_item[];
}
export type Sidebar_content_type=sidebar_links | sidebar_dropdown