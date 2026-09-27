export type NavLink = {
  name: string;
  href: string;
  id:number
};

export type NavbarLinkItem = {
  type: "link";
  link: NavLink;
};

export type NavbarDropdownItem = {
  type: "dropdown";
  id:number;
  name: string;
  links: NavLink[];
};

export type NavbarItem = NavbarLinkItem | NavbarDropdownItem;