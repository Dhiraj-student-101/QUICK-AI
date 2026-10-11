import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

const Layout = () => {
  return (
    <div className='flex'>
      <Sidebar />
      <div className='flex-1 min-h-screen bg-[#F4F6FB]'>
        <Outlet />
      </div>
    </div>
  )
}

export default Layout