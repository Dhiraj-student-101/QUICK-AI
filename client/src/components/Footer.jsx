import React, { useState } from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e) => {
    e.preventDefault()
    // TODO: wire up to a real newsletter/email service when ready
    setEmail('')
  }

  return (
    <footer className='w-full border-t border-gray-200 bg-white'>
      <div className='max-w-6xl mx-auto px-6 sm:px-10 py-12 flex flex-col md:flex-row justify-between gap-10'>
        <div className='max-w-xs'>
          <div className='flex items-center gap-2'>
            <img src={assets.logo} alt='Quick.ai' className='h-7' />
          </div>
          <p className='mt-4 text-sm text-gray-500 leading-relaxed'>
            Experience the power of AI with QuickAi.
            Transform your content creation with our suite of premium AI
            tools. Write articles, generate images, and enhance your
            workflow.
          </p>
        </div>

        <div className='flex gap-16 flex-wrap'>
          <div>
            <h3 className='font-semibold text-slate-800 mb-3'>Company</h3>
            <ul className='space-y-2 text-sm text-gray-500'>
              <li><a href='/' className='hover:text-primary transition'>Home</a></li>
              <li><a href='#' className='hover:text-primary transition'>About us</a></li>
              <li><a href='#' className='hover:text-primary transition'>Contact us</a></li>
              <li><a href='#' className='hover:text-primary transition'>Privacy policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className='font-semibold text-slate-800 mb-3'>
              Subscribe to our newsletter
            </h3>
            <p className='text-sm text-gray-500 mb-3 max-w-xs'>
              The latest news, articles, and resources, sent to your inbox weekly.
            </p>
            <form onSubmit={handleSubscribe} className='flex gap-2'>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter your email'
                required
                className='px-3 py-2 text-sm rounded-md border border-gray-300 outline-none focus:border-primary transition w-48'
              />
              <button
                type='submit'
                className='px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:opacity-90 transition'
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className='border-t border-gray-200 py-4'>
        <p className='text-center text-xs text-gray-400'>
          Copyright {new Date().getFullYear()} @Dhiraj Kumar All Right Reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer