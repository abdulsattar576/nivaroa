import React from 'react'
import { socialData } from './footer'

const SocialMedia = () => {
    return (
        <div >
            <h2 className='text-lg font-bold border-b-accent'>Contact Us</h2>

            <div className='flex flex-col gap-2'>
                {

                socialData.map(({ icon: Icon, value }, index) => (
                    <address key={index} className='flex items-center  gap-4'>
                        <Icon  size={20} />
                        <a className='text-sm' href={value.includes("@") ? `mailto:${value}` : `tel:${value}`}>{value}</a>

                    </address>
                ))
            }
            </div>

        </div>
    )
}

export default SocialMedia