import React, { useState } from 'react'
import { NavLink } from './type'
import Link from 'next/link'
 
type DrawerListProps={
    data:NavLink,
    
}
const DrawerList = ({data}:DrawerListProps) => {
    const [show, setshow] = useState(false)
  return (
    
 <div className='items-center gap-4  text-text inline-block'>
    <Link   href={data.href} className='text-text hover:text-accent hover:bg-surface-muted'>{data.name}</Link>
    </div>
  )
}

export default DrawerList