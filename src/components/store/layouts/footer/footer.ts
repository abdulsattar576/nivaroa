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
          { name: "Clothes", link: "/shop?category=clothes" },
          { name: "Electronics", link: "/shop?category=electronics" },
          { name: "Men", link: "/shop?category=men" },
          { name: "Women", link: "/shop?category=women" },
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
        { name: "About Us", link: "/about" },
        { name: "Contact Support", link: "/contact" },
        { name: "Our Services", link: "/services" },
      ],
    },
    {
      heading: "Policy",
      links: [
        { name: "Privacy Policy", link: "/privacy" },
        { name: "Terms & Conditions", link: "/terms" },
        { name: "Payment Information", link: "/payment-info" },
        { name: "Replacement & Warranty", link: "/replacement-and-warranty" },
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