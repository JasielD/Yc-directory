import React from 'react'
import Navbar from '../../components/Navbar'
import { Toaster } from 'sonner'

const layout = ({children}: Readonly<{children:React.ReactNode}>) => {
  return (
    <div>
      <main className='font-work-sans'>
        <Navbar />
        {children}
        <Toaster/>
      </main>
    </div>
  )
}

export default layout
