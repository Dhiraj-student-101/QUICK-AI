import React from 'react'
import { Check } from 'lucide-react'
import { useClerk, useUser } from '@clerk/clerk-react'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    subtitle: 'Always free',
    features: ['Title Generation', 'Article Generation'],
    isActive: true, // TODO: derive this from actual user subscription state
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 16,
    subtitle: 'Only billed monthly',
    features: [
      'Title Generation',
      'Article Generation',
      'Generate Images',
      'Remove Background',
      'Remove Object',
      'Resume Review',
    ],
    isActive: false,
  },
]

const Plan = () => {
  const { openSignIn } = useClerk()
  const { user } = useUser()

  const handleSubscribe = (planId) => {
    if (!user) {
      openSignIn()
      return
    }
   
    console.log('Subscribe clicked:', planId)
  }

  return (
    <div className='max-w-4xl mx-auto px-4 py-16'>
      <div className='text-center mb-12'>
        <h1 className='text-3xl sm:text-4xl font-bold text-slate-800'>
          Choose Your Plan
        </h1>
        <p className='text-gray-500 mt-3 max-w-md mx-auto'>
          Start for free and scale up as you grow. Find the perfect plan for
          your content creation needs.
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
        {plans.map((plan) => (
          <div
            key={plan.id}
            className='rounded-xl border border-gray-200 bg-white overflow-hidden flex flex-col'
          >
            {/* Header section with light gray bg */}
            <div className='bg-gray-50 px-6 pt-6 pb-5 border-b border-gray-200'>
              <div className='flex items-center justify-between mb-4'>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded text-white ${
                    plan.id === 'free' ? 'bg-blue-600' : 'bg-slate-900'
                  }`}
                >
                  {plan.id === 'free' ? 'Free' : plan.name}
                </span>
                {plan.isActive && (
                  <span className='text-xs font-medium px-2.5 py-1 rounded bg-slate-900 text-white'>
                    Active
                  </span>
                )}
              </div>

              <div className='flex items-baseline gap-1'>
                <span className='text-3xl font-bold text-slate-900'>
                  ${plan.price}
                </span>
                {plan.price > 0 && (
                  <span className='text-gray-400 text-sm'>/month</span>
                )}
              </div>
              <p className='text-xs text-gray-400 mt-1'>{plan.subtitle}</p>
            </div>

            {/* Features section */}
            <div className='px-6 py-5 flex-1'>
              <ul className='space-y-3'>
                {plan.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className='flex items-center gap-2 text-sm text-gray-600'
                  >
                    <Check className='w-4 h-4 text-gray-400 shrink-0' />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Subscribe button only for paid plan */}
            {plan.id !== 'free' && (
              <div className='px-6 pb-6'>
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  className='w-full py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition'
                >
                  Subscribe
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Plan