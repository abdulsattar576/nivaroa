"use client"
import React, { useState } from 'react'
import { NavbarItem } from './type'
import Link from 'next/link'
import { ChevronDown, ChevronUp } from 'lucide-react'
type DropdownProps = {
    data: NavbarItem
}
const Dropdown = ({ data }: DropdownProps) => {
    const [show, setshow] = useState(false)
    return (
        <section>
            <div className='flex gap-4'>
                {
                    data.type === "link" ? <Link href={data.link.href}>{data.link.name}</Link> :
                        <div className='relative'>
                          
                            <button className='flex items-center' aria-expanded={show} aria-haspopup="menu" onClick={() => setshow(!show)}>{data.name} {show ? <ChevronUp  size={20} className='text-white inline-block' /> : <ChevronDown size={20} className='text-white inline-block' />}</button>
                           
                            {
                                show && <div className='flex flex-col absolute top-full mt-4 min-w-48 left-0 rounder-md'>{
                                    data.links.map((item) => (
                                        <Link href={item.href} key={item.id} className='bg-teal-600 text-white'>{item.name}</Link>
                                    ))
                                }</div>
                            }
                        </div>
                }
            </div>
        </section>
    )
}

export default Dropdown