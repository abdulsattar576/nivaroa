import React from 'react'
import { footersection } from './footer'
import Link from 'next/link'
import Image from 'next/image'
import { Images } from '@/constant/Image'
import SocialMedia from './Social.media'

const Footer = () => {
    const { logo } = Images
    return (
        <footer className='bg-primary text-white'>

            <div className='max-w-7xl mx-auto flex flex-col md:flex-row gap-10 py-10 px-4 '>
                {/*brand section  */}
                <div className='max-w-md px-2 flex flex-col gap-8 md:w-1/3'>
                    <Link href="/">                <Image src={logo} alt='nivaroa' width={80} height={80} className='w-24 h-24 object-contain ' />
                    </Link>
                    <p className='text-sm leading-6'>Nivaroa is a modern e-commerce brand built around quality, convenience, and everyday style.
                        We bring together carefully selected products across multiple categories in one seamless shopping experience.
                        Our goal is to make online shopping simple, reliable, and worth coming back to.
                    </p>
                    <div>
                    </div>
                </div>
                {/* links section */}
                <div className='w-full grid grid-cols-2 sm:grid-cols-3 md:flex-1'>
                    {
                        footersection.map(({ heading, links }, ind) => (
                            <div key={ind}><h2 className='text-lg font-bold border-b-2 border-white inline-block'>{heading}</h2>
                                <div className='flex flex-col gap-2.5 mt-4'>
                                    {
                                        links.map(({ name, link }, index) => (
                                            <Link className='text-sm text-slate-300 transition-colors hover:text-accent text-primary-muted' key={index} href={link}>{name}</Link>
                                        ))
                                    }
                                </div></div>
                        ))
                    }

                </div>
                {/* social media section */}
                <div className='md:w-1/4'>
                    <SocialMedia />
                </div>
            </div>

            <p className="text-sm text-primary-muted text-center py-4 border-t border-white">
                © 2026 Nivaroa. All rights reserved.
            </p>
        </footer>
    )
}

export default Footer