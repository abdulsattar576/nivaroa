import React from 'react'
import { footersection } from './footer'
import Link from 'next/link'
import Image from 'next/image'
import { Images } from '@/constant/Image'

const Footer = () => {
    const { logo } = Images
    return (
<footer className='w-full  bg-primary text-white py-10 md:py-14'>

            <div className='w-full'>
                <Image src={logo} alt='nivaroa' width={80} height={80} />
                <p className=''>Nivaroa is a modern e-commerce brand built around quality, convenience, and everyday style.
                    We bring together carefully selected products across multiple categories in one seamless shopping experience.
                    Our goal is to make online shopping simple, reliable, and worth coming back to.
                </p>
                <div>
                    <Link href="https://www.linkedin.com/abdul-sattar-se">
                    Linkedin
                    </Link>
                </div>
            </div>
            <div className='flex justify-evenly'>
                {
                    footersection.map(({ heading, links }, ind) => (
                        <div key={ind}><h2 className='text-lg font-bold border-b-accent'>{heading}</h2>
                            <div className='flex flex-col gap-2.5'>
                                {
                                    links.map(({ name, link }, index) => (
                                        <Link key={index} href={link}>{name}</Link>
                                    ))
                                }
                            </div></div>
                    ))
                }

            </div>
        </footer>
    )
}

export default Footer