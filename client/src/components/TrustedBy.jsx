import React from 'react'

const logos = [
  { name: 'Instagram', text: 'Instagram', color: '#8a8a8a', italic: true },
  { name: 'Facebook', text: 'facebook', color: '#1877F2', bold: true },
  { name: 'Slack', text: 'slack', color: '#4A154B', bold: true },
  { name: 'Framer', text: 'Framer', color: '#0055FF', bold: true },
  { name: 'Netflix', text: 'NETFLIX', color: '#E50914', bold: true },
  { name: 'Google', text: 'Google', google: true, bold: true },
  { name: 'LinkedIn', text: 'LinkedIn', color: '#0A66C2', bold: true },
]

const GoogleLogo = () => (
  <span className='text-2xl font-semibold'>
    <span style={{ color: '#4285F4' }}>G</span>
    <span style={{ color: '#EA4335' }}>o</span>
    <span style={{ color: '#FBBC05' }}>o</span>
    <span style={{ color: '#4285F4' }}>g</span>
    <span style={{ color: '#34A853' }}>l</span>
    <span style={{ color: '#EA4335' }}>e</span>
  </span>
)

const TrustedBy = () => {
  const marqueeLogos = [...logos, ...logos]

  return (
    <div className='w-full overflow-hidden bg-white py-8'>
      <style>{`
        @keyframes trusted-scroll-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .trusted-marquee-track {
          animation: trusted-scroll-left 20s linear infinite;
        }
      `}</style>

      <div className='flex trusted-marquee-track w-max items-center'>
        {marqueeLogos.map((logo, idx) =>
          logo.google ? (
            <span key={idx} className='mx-10 shrink-0 whitespace-nowrap select-none'>
              <GoogleLogo />
            </span>
          ) : (
            <span
              key={idx}
              className={`mx-10 shrink-0 text-2xl whitespace-nowrap select-none ${
                logo.bold ? 'font-bold' : 'font-medium'
              } ${logo.italic ? 'italic' : ''}`}
              style={{ color: logo.color }}
            >
              {logo.text}
            </span>
          )
        )}
      </div>
    </div>
  )
}

export default TrustedBy