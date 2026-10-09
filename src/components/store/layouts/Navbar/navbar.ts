import { NavbarItem, NavLink } from "./type";
import type { CategoryRecord } from "@/features/categories/schemas/category.schema";

export function buildNavbarData(categories: CategoryRecord[] = []): NavbarItem[] {
  const categoryLinks: NavLink[] =
    categories.length > 0
      ? categories.map((cat, idx) => ({
          id: idx + 1,
          name: cat.name,
          href: `/categories/${encodeURIComponent(cat.slug)}`,
        }))
      : [
          {
            id: 1,
            name: "Clothes",
            href: "/categories/clothes",
          },
          {
            id: 2,
            name: "Electronics",
            href: "/categories/electronics",
          },
          {
            id: 3,
            name: "Men",
            href: "/categories/men",
          },
          {
            id: 4,
            name: "Women",
            href: "/categories/women",
          },
        ];

  return [
    {
      type: "link",
      link: {
        id: 1,
        name: "Home",
        href: "/",
      },
    },
    {
      type: "dropdown",
      name: "Collection",
      id: 2,
      links: categoryLinks,
    },
    {
      type: "link",
      link: {
        id: 3,
        name: "Contact",
        href: "/contact",
      },
    },
    {
      type: "link",
      link: {
        id: 4,
        name: "About",
        href: "/about",
      },
    },
    {
      type: "link",
      link: {
        id: 5,
        name: "Shop",
        href: "/shop",
      },
    },
  ];
}

export const NavbarData: NavbarItem[] = buildNavbarData();