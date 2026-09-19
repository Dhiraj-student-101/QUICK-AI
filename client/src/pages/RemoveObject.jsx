import React, { useState } from 'react'
import { Sparkles, Scissors, Download, Upload } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const RemoveObject = () => {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [objectDescription, setObjectDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [resultImage, setResultImage] = useState('')
  const [error, setError] = useState('')

  const { getToken } = useAuth()

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (!selected) return

    setFile(selected)
    setResultImage('')
    setError('')
    setPreviewUrl(URL.createObjectURL(selected))
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!file || !objectDescription.trim()) return

    setLoading(true)
    setResultImage('')
    setError('')

    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('object', objectDescription)

      const { data } = await axios.post('/api/ai/remove-image-object', formData, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      })

      if (data.success) {
        setResultImage(data.content)
      } else {
        setError(data.message || 'Something went wrong.')
      }
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to remove object. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = resultImage
    link.download = 'object-removed.png'
    link.click()
  }

  return (
    <div className='h-full overflow-y-auto p-6 flex flex-wrap gap-4 items-start'>
      <form
        onSubmit={onSubmitHandler}
        className='w-full max-w-lg bg-white rounded-xl border border-gray-200 p-6'
      >
        <div className='flex items-center gap-2'>
          <Sparkles className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className='text-lg font-semibold text-slate-800'>Object Removal</h1>
        </div>

        <p className='mt-6 text-sm font-medium text-slate-700'>Upload Image</p>

        <label
          htmlFor='obj-upload'
          className='mt-2 flex flex-col items-center justify-center gap-2 w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition overflow-hidden'
        >
          {previewUrl ? (
            <img src={previewUrl} alt='Preview' className='w-full h-full object-contain' />
          ) : (
            <>
              <Upload className='w-6 h-6 text-gray-400' />
              <p className='text-xs text-gray-400'>Click to upload or drag and drop</p>
            </>
          )}
        </label>

        <input
          id='obj-upload'
          type='file'
          accept='image/*'
          onChange={handleFileChange}
          className='hidden'
          required
        />

        <p className='mt-4 text-sm font-medium text-slate-700'>Describe Object to Remove</p>
        <textarea
          value={objectDescription}
          onChange={(e) => setObjectDescription(e.target.value)}
          rows={3}
          className='w-full p-2.5 mt-2 outline-none text-sm rounded-md border border-gray-300 focus:border-primary transition resize-none'
          placeholder='e.g. the car in the background, the red umbrella...'
          required
        />
        <p className='text-xs text-gray-400 mt-1'>Be as specific as possible for best results</p>

        <button
          disabled={loading}
          type='submit'
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417DF6] to-[#8E37EB] text-white px-4 py-2.5 mt-6 text-sm rounded-lg disabled:opacity-50 cursor-pointer hover:opacity-90 transition'
        >
          {loading ? (
            <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent border-white animate-spin' />
          ) : (
            <Scissors className='w-5' />
          )}
          Remove Object
        </button>

        {error && <p className='text-xs text-red-500 mt-3'>{error}</p>}
      </form>

      <div className='w-full max-w-lg bg-white rounded-xl border border-gray-200 p-6 flex flex-col min-h-96 max-h-[600px]'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Scissors className='w-5 h-5 text-[#4A7AFF]' />
            <h1 className='text-lg font-semibold text-slate-800'>Processed Image</h1>
          </div>

          {resultImage && (
            <button
              onClick={handleDownload}
              className='flex items-center gap-1 text-xs text-gray-500 hover:text-slate-800 transition'
            >
              <Download className='w-4 h-4' />
              Download
            </button>
          )}
        </div>

        {!resultImage ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Scissors className='w-9 h-9' />
              <p>Upload an image and describe the object to remove</p>
            </div>
          </div>
        ) : (
          <div className='mt-4 flex-1 flex items-center justify-center overflow-hidden rounded-lg'>
            <img src={resultImage} alt='Result' className='max-w-full max-h-full object-contain' />
          </div>
        )}
      </div>
    </div>
  )
}

export default RemoveObject