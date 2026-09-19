import React, { useState } from 'react'
import { Sparkles, Edit, Copy, Check, Loader2 } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import Markdown from 'react-markdown'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const WriteArticle = () => {
  const articleLengthOptions = [
    { length: 800, text: 'Short (500-800 words)' },
    { length: 1200, text: 'Medium (800-1200 words)' },
    { length: 1600, text: 'Long (1200+ words)' },
  ]

  const [selectedLength, setSelectedLength] = useState(articleLengthOptions[0])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('')
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
    setLoadingText('Connecting to AI Model...')

    // Animated loading status updates for fast perceived performance
    const t1 = setTimeout(() => setLoadingText('Analyzing topic & structure...'), 800)
    const t2 = setTimeout(() => setLoadingText('Formatting markdown response...'), 1800)

    try {
      const prompt = `Write a detailed, well-structured article about "${input}". Use headings and clear paragraphs.`

      const { data } = await axios.post(
        '/api/ai/generate-article',
        { prompt, length: selectedLength.length },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      )

      if (data.success) {
        setContent(data.content)
      } else {
        setError(data.message || 'Something went wrong.')
      }
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to generate article. Please try again.')
    } finally {
      clearTimeout(t1)
      clearTimeout(t2)
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className='h-full overflow-y-auto p-6 flex flex-wrap gap-4 items-start max-w-7xl mx-auto'>
      {/* Input Form */}
      <form
        onSubmit={onSubmitHandler}
        className='w-full max-w-lg bg-white rounded-xl border border-gray-200 p-6'
      >
        <div className='flex items-center gap-2'>
          <Sparkles className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className='text-lg font-semibold text-slate-800'>
            Article Configuration
          </h1>
        </div>

        <p className='mt-6 text-sm font-medium text-slate-700'>
          Article Topic
        </p>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type='text'
          className='w-full p-2.5 mt-2 outline-none text-sm rounded-md border border-gray-300 focus:border-[#226BFF] transition'
          placeholder='The future of artificial intelligence...'
          required
        />

        <p className='mt-4 text-sm font-medium text-slate-700'>
          Article Length
        </p>
        <div className='mt-2 flex gap-3 flex-wrap'>
          {articleLengthOptions.map((option, idx) => (
            <span
              key={idx}
              onClick={() => setSelectedLength(option)}
              className={`text-xs px-4 py-1.5 rounded-full cursor-pointer border transition ${
                selectedLength.text === option.text
                  ? 'bg-violet-50 text-violet-700 border-violet-300 font-semibold'
                  : 'text-gray-500 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {option.text}
            </span>
          ))}
        </div>

        <button
          disabled={loading}
          type='submit'
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2.5 mt-6 text-sm rounded-lg disabled:opacity-50 cursor-pointer hover:opacity-90 transition font-medium'
        >
          {loading ? (
            <>
              <Loader2 className='w-4 h-4 animate-spin' />
              <span className='animate-pulse'>{loadingText}</span>
            </>
          ) : (
            <>
              <Edit className='w-4 h-4' />
              Generate Article
            </>
          )}
        </button>

        {error && (
          <p className='text-xs text-red-500 mt-3'>{error}</p>
        )}
      </form>

      {/* Output Panel */}
      <div className='w-full max-w-lg bg-white rounded-xl border border-gray-200 p-6 flex flex-col min-h-96 max-h-[600px]'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Edit className='w-5 h-5 text-[#4A7AFF]' />
            <h1 className='text-lg font-semibold text-slate-800'>
              Generated Article
            </h1>
          </div>

          {content && (
            <button
              onClick={handleCopy}
              className='flex items-center gap-1 text-xs text-gray-500 hover:text-slate-800 transition font-medium'
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

        {!content && !loading ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Edit className='w-9 h-9' />
              <p>Enter a topic and click "Generate Article" to get started</p>
            </div>
          </div>
        ) : !content && loading ? (
          <div className='flex-1 flex flex-col justify-center items-center gap-3 text-slate-500'>
            <Loader2 className='w-8 h-8 text-[#4A7AFF] animate-spin' />
            <p className='text-sm font-medium animate-pulse'>{loadingText}</p>
          </div>
        ) : (
          <div className='mt-4 flex-1 overflow-y-auto pr-2'>
            <Markdown
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className='text-xl font-bold text-slate-800 mt-4 mb-2' {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className='text-lg font-bold text-slate-800 mt-4 mb-2' {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className='text-base font-bold text-slate-800 mt-3 mb-1' {...props} />
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

export default WriteArticle