import React, { useState } from 'react'
import { Sparkles, Eraser, Download, Upload } from 'lucide-react'
import { removeBackground } from '@imgly/background-removal'

const RemoveBackground = () => {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [resultImage, setResultImage] = useState('')
  const [error, setError] = useState('')

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

    if (!file) return

    setLoading(true)
    setResultImage('')
    setError('')

    try {
      // Runs entirely in the browser - no server call, no API key needed
      const resultBlob = await removeBackground(file)

      // Composite the transparent result onto a white background
      const transparentUrl = URL.createObjectURL(resultBlob)
      const img = new Image()
      img.src = transparentUrl

      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
      })

      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')

      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)

      const whiteBgUrl = canvas.toDataURL('image/png')
      setResultImage(whiteBgUrl)
    } catch (err) {
      console.error(err)
      setError('Failed to remove background. Please try a different image.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = resultImage
    link.download = 'background-removed.png'
    link.click()
  }

  return (
    <div className='h-full overflow-y-auto p-6 flex flex-wrap gap-4 items-start'>
      <form
        onSubmit={onSubmitHandler}
        className='w-full max-w-lg bg-white rounded-xl border border-gray-200 p-6'
      >
        <div className='flex items-center gap-2'>
          <Sparkles className='w-5 h-5 text-[#FF4938]' />
          <h1 className='text-lg font-semibold text-slate-800'>
            Background Removal
          </h1>
        </div>

        <p className='mt-6 text-sm font-medium text-slate-700'>Upload Image</p>

        <label
          htmlFor='bg-upload'
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
          id='bg-upload'
          type='file'
          accept='image/*'
          onChange={handleFileChange}
          className='hidden'
        />

        <p className='text-xs text-gray-400 mt-2'>Supports JPG, PNG, and WEBP formats</p>

        <button
          disabled={loading || !file}
          type='submit'
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white px-4 py-2.5 mt-6 text-sm rounded-lg disabled:opacity-50 cursor-pointer hover:opacity-90 transition'
        >
          {loading ? (
            <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent border-white animate-spin' />
          ) : (
            <Eraser className='w-5' />
          )}
          {loading ? 'Processing (may take a moment)...' : 'Remove Background'}
        </button>

        {error && <p className='text-xs text-red-500 mt-3'>{error}</p>}
      </form>

      <div className='w-full max-w-lg bg-white rounded-xl border border-gray-200 p-6 flex flex-col min-h-96 max-h-[600px]'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Eraser className='w-5 h-5 text-[#FF4938]' />
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
              <Eraser className='w-9 h-9' />
              <p>Upload an image and click "Remove Background" to get started</p>
            </div>
          </div>
        ) : (
          <div className='mt-4 flex-1 flex items-center justify-center overflow-hidden rounded-lg bg-white'>
            <img src={resultImage} alt='Result' className='max-w-full max-h-full object-contain' />
          </div>
        )}
      </div>
    </div>
  )
}

export default RemoveBackground