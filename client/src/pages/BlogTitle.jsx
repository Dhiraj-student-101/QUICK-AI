import React, { useState } from 'react'
import { Sparkles, Hash, Copy, Check } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import Markdown from 'react-markdown'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const BlogTitle = () => {
  const blogCategories = [
    'General',
    'Technology',
    'Business',
    'Health',
    'Lifestyle',
    'Education',
    'Travel',
    'Food',
  ]

  const [selectedCategory, setSelectedCategory] = useState(blogCategories[0])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const { getToken } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!input.trim()) return

    setLoading(true)
    setContent('')
    setError('')

    try {
      const { data } = await axios.post(
        '/api/ai/generate-blog-title',
        { keyword: input, category: selectedCategory },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      )

      if (data.success) {
        setContent(data.content)
      } else {
        setError(data.message || 'Something went wrong.')
      }
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to generate titles. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className='h-full overflow-y-auto p-6 flex flex-wrap gap-4 items-start'>
      {/* Left column - input form */}
      <form
        onSubmit={onSubmitHandler}
        className='w-full max-w-lg bg-white rounded-xl border border-gray-200 p-6'
      >
        <div className='flex items-center gap-2'>
          <Sparkles className='w-5 h-5 text-[#8E37EB]' />
          <h1 className='text-lg font-semibold text-slate-800'>
            Blog Title Generator
          </h1>
        </div>

        <p className='mt-6 text-sm font-medium text-slate-700'>Keyword</p>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type='text'
          className='w-full p-2.5 mt-2 outline-none text-sm rounded-md border border-gray-300 focus:border-primary transition'
          placeholder='The future of artificial intelligence...'
          required
        />

        <p className='mt-4 text-sm font-medium text-slate-700'>Category</p>
        <div className='mt-2 flex gap-3 flex-wrap'>
          {blogCategories.map((category, idx) => (
            <span
              key={idx}
              onClick={() => setSelectedCategory(category)}
              className={`text-xs px-4 py-1.5 rounded-full cursor-pointer border transition ${
                selectedCategory === category
                  ? 'bg-purple-50 text-purple-700 border-purple-300'
                  : 'text-gray-500 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category}
            </span>
          ))}
        </div>

        <button
          disabled={loading}
          type='submit'
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#C341F6] to-[#8E37EB] text-white px-4 py-2.5 mt-6 text-sm rounded-lg disabled:opacity-50 cursor-pointer hover:opacity-90 transition'
        >
          {loading ? (
            <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent border-white animate-spin' />
          ) : (
            <Hash className='w-5' />
          )}
          Generate Titles
        </button>

        {error && (
          <p className='text-xs text-red-500 mt-3'>{error}</p>
        )}
      </form>

      {/* Right column - output */}
      <div className='w-full max-w-lg bg-white rounded-xl border border-gray-200 p-6 flex flex-col min-h-96 max-h-[600px]'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Hash className='w-5 h-5 text-[#8E37EB]' />
            <h1 className='text-lg font-semibold text-slate-800'>
              Generated Titles
            </h1>
          </div>

          {content && (
            <button
              onClick={handleCopy}
              className='flex items-center gap-1 text-xs text-gray-500 hover:text-slate-800 transition'
            >
              {copied ? (
                <Check className='w-4 h-4 text-green-600' />
              ) : (
                <Copy className='w-4 h-4' />
              )}
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>

        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Hash className='w-9 h-9' />
              <p>Enter a keyword and click "Generate Titles" to get started</p>
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
                  <h2 className='text-base font-bold text-purple-700 mt-4 mb-2' {...props} />
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
                  <ul className='list-disc pl-5 mb-3 text-sm text-gray-600 space-y-1' {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className='list-decimal pl-5 mb-3 text-sm text-gray-600 space-y-1' {...props} />
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

export default BlogTitle