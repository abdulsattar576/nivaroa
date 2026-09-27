import React from 'react'
import { NavbarData } from './navbar'
import Hoc from './Hoc'
import Dropdown from './Dropdown'
import { Images } from '@/constant/Image'
import Image from 'next/image'
const NavbarHoc =Hoc(Dropdown)

const Navbar = () => {
  const{logo}=Images
  return (
    <nav className='bg-primary text-white py-6 px-4 '> 
    <div className='flex justify-evenly items-center gap-4'>
        <Image width={40} height={40} className='w-24 h-24 min-w-48' src={logo} alt="navaroa logo" />

     <div className='flex flex-1 justify-evenly items-center gap-4'>
       {
      NavbarData.map(((item)=>(
        <NavbarHoc key={item.type ==="link"?item.link.id:item.id} data={item}/>
       )))
    }
     </div>
    </div>
    </nav>
  )
}

export default Navbar