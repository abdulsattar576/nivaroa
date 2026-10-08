import { NavbarItem } from "./type";

export const NavbarData: NavbarItem[] = [
    {
        type: "link",
        link: {
            id:1,
            name: "Home",
            href: "/"
        }
    },
    {
type:"dropdown",
name:"Collection",
id:2,
links:[
    {
        id:1,
        name:"Clothes",
        href:"/shop/clothes"
    },
    {
        id:2,
        name:"Electronics",
        href:"/shop/electronics"
    },
    {
        id:3,
        name:"Men",
        href:"/shop/men"
    },
    {
        id:4,
        name:"Women",
        href:"/shop/women"
    }
]
    },
{
    type:"link",
    link:{
        id:3,
        name:"Contact",
        href:"/contact"
    }
},
{
    type:"link",
    link: {
        id:4,
        name:"About",
        href:"/about"
    }
},
{
    type:"link",
    link:{
        id:5,
        name:"Shop",
        href:"/shop"
    }
},



]