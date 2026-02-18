'use client'

const VideoBackground = () => {
  return (
    <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
    >
        <source src="/loginpageVideo/home-login.mp4" type="video/mp4"/>
    </video>
  )
}

export default VideoBackground
