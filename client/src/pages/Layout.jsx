// import React from "react";
// import { Outlet } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";

// const Layout = () => {
//   return (
//     <div className="h-screen flex flex-col ">
//     <Navbar />

//     <div className="flex flex-1 pt-20 overflow-hidden">
//         <Sidebar />

//         <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
//             <Outlet />
//         </div>
//     </div>
// </div>
//   );
// };

// export default Layout;

import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useUser, useClerk } from '@clerk/clerk-react'

const Layout = () => {
  const { isSignedIn, isLoaded } = useUser()
  const { openSignIn } = useClerk()

  useEffect(() => {
    // Agar user login nahi hai, toh automatic Sign-In popup open kar do
    if (isLoaded && !isSignedIn) {
      openSignIn()
    }
  }, [isLoaded, isSignedIn])

  if (!isLoaded) return null

  // Agar user signed-in nahi hai, toh feature dikhane ki jagah Login button render karo
  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F4F6FB] p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
          <p className="text-sm text-gray-500 mb-6">
            Is AI feature ko use karne ke liye please apna account login ya sign up karein.
          </p>
          <button
            onClick={() => openSignIn()}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-95"
          >
            Sign In / Sign Up to Continue
          </button>
        </div>
      </div>
    )
  }

  // Agar user logged in hai, toh normal tool aur sidebar render hoga
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