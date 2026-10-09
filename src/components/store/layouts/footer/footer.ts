import { Mail, Phone } from "lucide-react";
import { FooterSection, SocialMediaIcons } from "./type";
import type { CategoryRecord } from "@/features/categories/schemas/category.schema";

export function buildFooterSections(categories: CategoryRecord[] = []): FooterSection[] {
  const shopLinks =
    categories.length > 0
      ? categories.slice(0, 5).map((cat) => ({
          name: cat.name,
          link: `/shop?category=${encodeURIComponent(cat.slug)}`,
        }))
      : [
          { name: "Men", link: "/shop?category=men" },
          { name: "Women", link: "/shop?category=women" },
          { name: "Clothes", link: "/shop?category=clothes" },
          { name: "Electronics", link: "/shop?category=electronics" },
        ];

  return [
    {
      heading: "Shop",
      links: shopLinks,
    },
    {
      heading: "Navigation",
      links: [
        { name: "Home", link: "/" },
        { name: "About", link: "/about" },
        { name: "Services", link: "/services" },
      ],
    },
    {
      heading: "Policy",
      links: [
        { name: "Payment Information", link: "/payment-info" },
        { name: "Privacy Policy", link: "/privacy-policy" },
        { name: "Replacement & Warranty", link: "/replacement-and-warranty" },
        { name: "Warranty by Nivaroa", link: "/nivaroa-warranty" },
      ],
    },
  ];
}

export const footersection: FooterSection[] = buildFooterSections();

export const socialData: SocialMediaIcons[] = [
  {
    icon: Phone,
    value: "+923039391913",
  },
  {
    icon: Mail,
    value: "Nivaroa@gmail.com",
  },
];