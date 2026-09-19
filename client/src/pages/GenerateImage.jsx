import React, { useState } from 'react'
import { Sparkles, Image as ImageIcon, Download } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const GenerateImages = () => {
  const imageStyles = [
    'Realistic',
    'Anime style',
    'Cartoon',
    'Fantasy art',
    '3D style',
    'Portrait style',
  ]

  const [selectedStyle, setSelectedStyle] = useState(imageStyles[0])
  const [input, setInput] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState('')
  const [error, setError] = useState('')

  const { getToken } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!input.trim()) return

    setLoading(true)
    setImage('')
    setError('')

    try {
      const fullPrompt = `${input}, in the style ${selectedStyle}`

      const { data } = await axios.post(
        '/api/ai/generate-image',
        { prompt: fullPrompt, isPublic },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      )

      if (data.success) {
        setImage(data.content)
      } else {
        setError(data.message || 'Something went wrong.')
      }
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to generate image. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = image
    link.download = 'generated-image.png'
    link.click()
  }

  return (
    <div className='h-full overflow-y-auto p-6 flex flex-wrap gap-4 items-start'>
      <form
        onSubmit={onSubmitHandler}
        className='w-full max-w-lg bg-white rounded-xl border border-gray-200 p-6'
      >
        <div className='flex items-center gap-2'>
          <Sparkles className='w-5 h-5 text-[#00AD25]' />
          <h1 className='text-lg font-semibold text-slate-800'>
            AI Image Generator
          </h1>
        </div>

        <p className='mt-6 text-sm font-medium text-slate-700'>
          Describe Your Image
        </p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          className='w-full p-2.5 mt-2 outline-none text-sm rounded-md border border-gray-300 focus:border-primary transition resize-none'
          placeholder='A boy fishing on a boat at sunset...'
          required
        />

        <p className='mt-4 text-sm font-medium text-slate-700'>Style</p>
        <div className='mt-2 flex gap-3 flex-wrap'>
          {imageStyles.map((style, idx) => (
            <span
              key={idx}
              onClick={() => setSelectedStyle(style)}
              className={`text-xs px-4 py-1.5 rounded-full cursor-pointer border transition ${
                selectedStyle === style
                  ? 'bg-green-50 text-green-700 border-green-300'
                  : 'text-gray-500 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {style}
            </span>
          ))}
        </div>

        <div className='flex items-center gap-2 mt-4'>
          <label className='relative inline-flex items-center cursor-pointer'>
            <input
              type='checkbox'
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className='sr-only peer'
            />
            <div className='w-9 h-5 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-colors' />
            <span className='absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4' />
          </label>
          <p className='text-sm text-gray-600'>Make this image public</p>
        </div>

        <button
          disabled={loading}
          type='submit'
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00AD25] to-[#04FF50] text-white px-4 py-2.5 mt-6 text-sm rounded-lg disabled:opacity-50 cursor-pointer hover:opacity-90 transition'
        >
          {loading ? (
            <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent border-white animate-spin' />
          ) : (
            <ImageIcon className='w-5' />
          )}
          Generate Image
        </button>

        {error && <p className='text-xs text-red-500 mt-3'>{error}</p>}
      </form>

      <div className='w-full max-w-lg bg-white rounded-xl border border-gray-200 p-6 flex flex-col min-h-96 max-h-[600px]'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <ImageIcon className='w-5 h-5 text-[#00AD25]' />
            <h1 className='text-lg font-semibold text-slate-800'>
              Generated Image
            </h1>
          </div>

          {image && (
            <button
              onClick={handleDownload}
              className='flex items-center gap-1 text-xs text-gray-500 hover:text-slate-800 transition'
            >
              <Download className='w-4 h-4' />
              Download
            </button>
          )}
        </div>

        {!image ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <ImageIcon className='w-9 h-9' />
              <p>Describe an image and click "Generate Image" to get started</p>
            </div>
          </div>
        ) : (
          <div className='mt-4 flex-1 flex items-center justify-center overflow-hidden'>
            <img
              src={image}
              alt='Generated'
              className='max-w-full max-h-full rounded-lg object-contain'
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default GenerateImages