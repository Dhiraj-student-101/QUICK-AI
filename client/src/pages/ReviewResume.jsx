import React, { useState } from 'react'
import { Sparkles, FileText, Upload } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import Markdown from 'react-markdown'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const ReviewResume = () => {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  const { getToken } = useAuth()

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (!selected) return
    setFile(selected)
    setContent('')
    setError('')
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!file) return

    setLoading(true)
    setContent('')
    setError('')

    try {
      const formData = new FormData()
      formData.append('resume', file)

      const { data } = await axios.post('/api/ai/resume-review', formData, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      })

      if (data.success) {
        setContent(data.content)
      } else {
        setError(data.message || 'Something went wrong.')
      }
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to review resume. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='h-full overflow-y-auto p-6 flex flex-wrap gap-4 items-start'>
      <form
        onSubmit={onSubmitHandler}
        className='w-full max-w-lg bg-white rounded-xl border border-gray-200 p-6'
      >
        <div className='flex items-center gap-2'>
          <Sparkles className='w-5 h-5 text-[#00DA83]' />
          <h1 className='text-lg font-semibold text-slate-800'>Resume Review</h1>
        </div>

        <p className='mt-6 text-sm font-medium text-slate-700'>Upload Resume</p>

        <label
          htmlFor='resume-upload'
          className='mt-2 flex flex-col items-center justify-center gap-2 w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition px-4 text-center'
        >
          <Upload className='w-6 h-6 text-gray-400' />
          <p className='text-xs text-gray-500 truncate max-w-full'>
            {file ? file.name : 'Click to upload your resume (PDF)'}
          </p>
        </label>

        <input
          id='resume-upload'
          type='file'
          accept='application/pdf'
          onChange={handleFileChange}
          className='hidden'
          required
        />

        <p className='text-xs text-gray-400 mt-2'>Supports PDF format only</p>

        <button
          disabled={loading}
          type='submit'
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00DA83] to-[#009BB3] text-white px-4 py-2.5 mt-6 text-sm rounded-lg disabled:opacity-50 cursor-pointer hover:opacity-90 transition'
        >
          {loading ? (
            <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent border-white animate-spin' />
          ) : (
            <FileText className='w-5' />
          )}
          Review Resume
        </button>

        {error && <p className='text-xs text-red-500 mt-3'>{error}</p>}
      </form>

      <div className='w-full max-w-lg bg-white rounded-xl border border-gray-200 p-6 flex flex-col min-h-96 max-h-[600px]'>
        <div className='flex items-center gap-2'>
          <FileText className='w-5 h-5 text-[#00DA83]' />
          <h1 className='text-lg font-semibold text-slate-800'>Analysis Results</h1>
        </div>

        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <FileText className='w-9 h-9' />
              <p>Upload a resume and click "Review Resume" to get started</p>
            </div>
          </div>
        ) : (
          <div className='mt-4 flex-1 overflow-y-auto'>
            <Markdown
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className='text-lg font-bold text-slate-800 mt-4 mb-2' {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className='text-base font-bold text-slate-800 mt-4 mb-2' {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className='text-sm font-bold text-slate-800 mt-3 mb-1' {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className='text-sm text-gray-600 leading-relaxed mb-2' {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className='font-bold text-slate-800' {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className='list-disc pl-5 mb-2 text-sm text-gray-600 space-y-1' {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className='list-decimal pl-5 mb-2 text-sm text-gray-600 space-y-1' {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className='leading-relaxed' {...props} />
                ),
              }}
            >
              {content}
            </Markdown>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewResume