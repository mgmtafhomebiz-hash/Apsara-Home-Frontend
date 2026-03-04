'use client'

import { useState } from 'react'

const VideoBackground = () => {
  const [isReady, setIsReady] = useState(false)

  return (
    <div className="absolute inset-0">
      {/* Fallback layer para hindi gray/blank habang naglo-load ang video */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="https://res.cloudinary.com/dc05ncs6l/video/upload/so_0/home-login_xaavth.jpg"
        onLoadedData={() => setIsReady(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
          isReady ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <source src="https://res.cloudinary.com/dc05ncs6l/video/upload/v1772612923/home-login_xaavth.mp4" type="video/mp4" />
      </video>
    </div>
  )
}

export default VideoBackground
