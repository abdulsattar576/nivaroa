import { Mail, Phone } from "lucide-react"
import { FooterSection,SocialMediaIcons } from "./type"
export const footersection:FooterSection[]=[
{
    heading:"Shop",
    
    links:[
        {name:"Men",
            link:"/shop/men"
        },
        {
            name:"Women",
            link:"/shop/women"
        },
        {
            name:"Clothes",
            link:"/shop/clothes"
        },
        {
            name:"Electronics",
            link:"/shop/electronics"
        }
    ]
},
{
    heading:"Navigation",
    links:[
        {
            name:"Home",
            link:"/"
        },
        {
            name:"About",
            link:"/about"
        },
         
        {
            name:"Services",
           link: "/services"
        }
    ]
},
{
    heading:"Policy",
    links:[
        {
            name:"Payment Information",
            link:"/payment-info"
        },
        {
            name:"Privacy Policy",
            link:"/privacy-policy"
        },
        {
            name:"Replacement & Warranty",
            link:"/replacement-and-warranty"
        },
        {
            name:"Warrenty by Nivaroa",
            link:"/nivaroa-warrenty"
        }
    ]
}
]
export const socialData:SocialMediaIcons[]=[
    {
       icon:Phone,
       value:"+923039391913" 
    },
    {
        icon:Mail,
        value:"Nivaroa@gmail.com"
    }
]