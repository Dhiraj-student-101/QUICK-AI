import React, { useState } from 'react'
import { Heart } from 'lucide-react'
import { dummyPublishedCreationData } from '../assets/assets'
import { useUser } from '@clerk/clerk-react'

const Community = () => {
  const { user } = useUser()
  const [creations, setCreations] = useState(dummyPublishedCreationData)

  const toggleLike = (id) => {
    if (!user) return

    setCreations((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item

        const alreadyLiked = item.likes.includes(user.id)
        return {
          ...item,
          likes: alreadyLiked
            ? item.likes.filter((uid) => uid !== user.id)
            : [...item.likes, user.id],
        }
      })
    )

    // TODO: replace with real API call once backend is ready
    // await axios.post(`/api/creations/${id}/like`)
  }

  return (
    <div className='h-full overflow-y-auto p-6'>
      <h1 className='text-lg font-semibold text-slate-800 mb-4'>
        Community Creations
      </h1>

      {creations.length === 0 ? (
        <div className='p-8 text-center text-sm text-gray-400 bg-white rounded-xl border border-gray-200'>
          No published creations yet.
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {creations.map((item) => {
            const liked = user ? item.likes.includes(user.id) : false

            return (
              <div
                key={item.id}
                className='relative group bg-white rounded-xl border border-gray-200 overflow-hidden'
              >
                <img
                  src={item.content}
                  alt={item.prompt}
                  className='w-full h-48 object-cover'
                />

                <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition'>
                  <p className='text-white text-xs line-clamp-2'>
                    {item.prompt}
                  </p>
                </div>

                <button
                  onClick={() => toggleLike(item.id)}
                  className='absolute top-2 right-2 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded-full hover:bg-black/70 transition'
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      liked ? 'fill-red-500 text-red-500' : 'text-white'
                    }`}
                  />
                  {item.likes.length}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Community