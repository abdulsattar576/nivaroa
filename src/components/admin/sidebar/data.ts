import { LayoutDashboard, Package, ShoppingBag, Tags, TrendingUp, Users } from "lucide-react";
import { Sidebar_content_type } from "./type";

export const Nav_data: Sidebar_content_type[] = [
  {
    type: "link",
    id: 1,
    icon: LayoutDashboard,
    links: {
      name: "Dashboard",
      href: "/admin",
      id: 1,
    },
  },
  {
    type: "link",
    id: 2,
    icon: ShoppingBag,
    links: {
      name: "Orders",
      href: "/admin/orders",
      id: 2,
    },
  },
  {
    type: "link",
    id: 5,
    icon: TrendingUp,
    links: {
      name: "Sales Analytics",
      href: "/admin/sales",
      id: 5,
    },
  },
  {
    type: "link",
    id: 6,
    icon: Users,
    links: {
      name: "Users",
      href: "/admin/users",
      id: 6,
    },
  },
  {
    type: "link",
    id: 3,
    icon: Tags,
    links: {
      name: "Categories",
      href: "/admin/categories",
      id: 3,
    },
  },
  {
    type: "dropdown",
    name: "Product",
    icon: Package,
    links: [
      {
        name: "All Product",
        href: "/admin/product",
        id: 1,
      },
      {
        name: "Add Product",
        href: "/admin/add-product",
        id: 2,
      },
    ],
  },
];