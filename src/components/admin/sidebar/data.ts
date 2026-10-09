import { LayoutDashboard, Package, Tags } from "lucide-react"
import { Sidebar_content_type } from "./type"
export const Nav_data: Sidebar_content_type[] = [
    {
        type: "link",
        id: 1,
        icon: LayoutDashboard,
        links: {
            name: "Dashboard",
            href: "/admin",
            id: 1,

        }

    },
    {
        type: "link",
        id: 2,
        icon: Tags,
        links: {
            name: "Categories",
            href: "/admin/categories",
            id: 2,
        }
    },
    {
        type: "dropdown",
        name: "Product",
        icon: Package,
        links: [
            {
                name:"All Product",
                href:"/admin/product",
                id:1
            },
            {
                name: "Add Product",
                href: "/admin/add-product",
                id: 2

            },
             
            
        ]
    }

]