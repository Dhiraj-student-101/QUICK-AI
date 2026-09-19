// import React, { useState } from 'react'
// import { Gem, Sparkles, ChevronDown } from 'lucide-react'
// import { dummyCreationData } from '../assets/assets'
// import { useUser } from '@clerk/clerk-react'

// const renderContent = (text) => {
//   const lines = text.split('\n')

//   return lines.map((line, idx) => {
//     if (line.startsWith('## ')) {
//       return (
//         <h3 key={idx} className='text-base font-semibold text-slate-800 mt-3 mb-1'>
//           {line.replace('## ', '')}
//         </h3>
//       )
//     }

//     const parts = line.split(/(\*\*.*?\*\*)/g)
//     return (
//       <p key={idx} className='text-sm text-gray-600 leading-relaxed'>
//         {parts.map((part, i) =>
//           part.startsWith('**') && part.endsWith('**') ? (
//             <strong key={i} className='font-semibold text-slate-800'>
//               {part.slice(2, -2)}
//             </strong>
//           ) : (
//             part
//           )
//         )}
//       </p>
//     )
//   })
// }

// const Dashboard = () => {
//   const { user } = useUser()
//   const [creations, setCreations] = useState(dummyCreationData)
//   const [expandedId, setExpandedId] = useState(null)

//   const toggleExpand = (id) => {
//     setExpandedId((prev) => (prev === id ? null : id))
//   }

//   const typeLabel = {
//     article: 'Article',
//     'blog-title': 'Blog Title',
//     image: 'Image',
//   }

//   return (
//     <div className='h-full overflow-y-scroll p-6'>
//       {/* Top cards */}
//       <div className='flex justify-start gap-4 flex-wrap'>
//         <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'>
//           <div className='text-slate-600'>
//             <p className='text-sm'>Total Creations</p>
//             <h2 className='text-xl font-semibold'>{creations.length}</h2>
//           </div>
//           <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center'>
//             <Sparkles className='w-5 text-white' />
//           </div>
//         </div>

//         <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'>
//           <div className='text-slate-600'>
//             <p className='text-sm'>Active Plan</p>
//             <h2 className='text-xl font-semibold'>Free</h2>
//           </div>
//           <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] text-white flex justify-center items-center'>
//             <Gem className='w-5 text-white' />
//           </div>
//         </div>
//       </div>

//       {/* Welcome line */}
//       <p className='mt-6 text-slate-600'>
//         Welcome back{user?.firstName ? `, ${user.firstName}` : ''} 👋
//       </p>

//       {/* Recent creations */}
//       <div className='mt-4'>
//         <p className='mb-4 font-medium text-slate-700'>Recent Creations</p>

//         {creations.length === 0 ? (
//           <div className='p-8 text-center text-sm text-gray-400 bg-white rounded-xl border border-gray-200'>
//             No creations yet. Start by writing an article or generating an image.
//           </div>
//         ) : (
//           <div className='space-y-3'>
//             {creations.map((item) => (
//               <div
//                 key={item.id}
//                 className='bg-white rounded-xl border border-gray-200 overflow-hidden'
//               >
//                 <div
//                   onClick={() => toggleExpand(item.id)}
//                   className='flex items-start justify-between p-4 cursor-pointer hover:bg-gray-50'
//                 >
//                   <div className='flex-1 pr-4'>
//                     <p className='text-sm font-medium text-slate-800 line-clamp-1'>
//                       {item.prompt}
//                     </p>
//                     <div className='flex items-center gap-3 mt-2'>
//                       <span className='text-xs px-2 py-1 rounded-full bg-violet-100 text-violet-700'>
//                         {typeLabel[item.type] || item.type}
//                       </span>
//                       <span className='text-xs text-gray-400'>
//                         {new Date(item.created_at).toLocaleDateString('en-US', {
//                           day: 'numeric',
//                           month: 'short',
//                           year: 'numeric',
//                         })}
//                       </span>
//                     </div>
//                   </div>

//                   <ChevronDown
//                     className={`w-4 h-4 text-gray-400 shrink-0 mt-1 transition-transform ${
//                       expandedId === item.id ? 'rotate-180' : ''
//                     }`}
//                   />
//                 </div>

//                 {expandedId === item.id && (
//                   <div className='px-4 pb-4 border-t border-gray-100 pt-3'>
//                     {item.type === 'image' ? (
//                       <img
//                         src={item.content}
//                         alt={item.prompt}
//                         className='w-full max-w-sm rounded-lg'
//                       />
//                     ) : (
//                       <div className='space-y-1'>
//                         {renderContent(item.content)}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default Dashboard





import React, { useEffect, useState } from 'react'
import { Sparkles, Gem } from 'lucide-react'
import axios from 'axios'
import { useAuth, useUser } from '@clerk/clerk-react'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const typeLabel = {
  article: 'article',
  'blog-title': 'blog-title',
  image: 'image',
  'resume-review': 'resume-review',
}

const Dashboard = () => {
  const { user } = useUser()
  const { getToken } = useAuth()

  const [creations, setCreations] = useState([])
  const [plan, setPlan] = useState('free')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchCreations = async () => {
    setLoading(true)
    setError('')

    try {
      const { data } = await axios.get('/api/user/get-creations', {
        headers: { Authorization: `Bearer ${await getToken()}` },
      })

      if (data.success) {
        setCreations(data.creations)
        setPlan(data.plan || 'free')
      } else {
        setError(data.message || 'Failed to load creations.')
      }
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to load creations.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchCreations()
    }
  }, [user])

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
  }

  return (
    <div className='h-full overflow-y-scroll p-6'>
      {/* Top cards */}
      <div className='flex justify-start gap-4 flex-wrap'>
        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'>
          <div className='text-slate-600'>
            <p className='text-sm'>Total Creations</p>
            <h2 className='text-xl font-semibold'>{creations.length}</h2>
          </div>
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center'>
            <Sparkles className='w-5 text-white' />
          </div>
        </div>

        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'>
          <div className='text-slate-600'>
            <p className='text-sm'>Active Plan</p>
            <h2 className='text-xl font-semibold capitalize'>{plan}</h2>
          </div>
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] text-white flex justify-center items-center'>
            <Gem className='w-5 text-white' />
          </div>
        </div>
      </div>

      {/* Recent creations */}
      <div className='mt-6'>
        <p className='mt-6 mb-4 font-medium text-slate-700'>Recent Creations</p>

        {loading ? (
          <div className='p-8 text-center text-sm text-gray-400 bg-white rounded-xl border border-gray-200'>
            Loading creations...
          </div>
        ) : error ? (
          <div className='p-8 text-center text-sm text-red-500 bg-white rounded-xl border border-gray-200'>
            {error}
          </div>
        ) : creations.length === 0 ? (
          <p className='text-sm text-gray-400'>No creations yet.</p>
        ) : (
          <div className='space-y-3'>
            {creations.map((item) => (
              <div
                key={item.id}
                className='flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200'
              >
                <div>
                  <p className='text-sm font-medium text-slate-800'>{item.prompt}</p>
                  <p className='text-xs text-gray-400 mt-1'>
                    {typeLabel[item.type] || item.type} - {formatDate(item.createdAt)}
                  </p>
                </div>
                <span className='text-xs px-3 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200 shrink-0 ml-3'>
                  {typeLabel[item.type] || item.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard