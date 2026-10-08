import { LucideIcon } from "lucide-react";

export type foorLink = {
    name: string;
    link: string;

}
export type FooterSection={
heading:string;
links:foorLink[]
}
export type SocialMediaIcons={
    icon:LucideIcon,
    value:string
}