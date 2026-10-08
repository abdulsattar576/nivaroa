import Footer from '@/components/store/layouts/footer/Footer'
import Navbar from '@/components/store/layouts/Navbar/Navbar'
import React from 'react'

const StoreLayout = ({children}:LayoutProps<"/">) => {
  return (
    <div className="min-h-screen flex flex-col justify-between">
           <Navbar/>
          <main>{children}</main>
          <Footer/>
        </div>
  )
}

export default StoreLayout