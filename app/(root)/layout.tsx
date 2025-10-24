import React from 'react'
import Navbar from '../../components/Navbar'

const layout = ({children}: Readonly<{children:React.ReactNode}>) => {
  return (
    <div>
      <main className='font-work-sans'>
        <Navbar />
        {children}
      </main>
    </div>
  )
}

export default layout
