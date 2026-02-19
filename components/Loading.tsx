'use client'

type LoadingProps = {
  size?: number
  className?: string
}

const Loading = ({ size = 16, className = '' }: LoadingProps) => {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-white/30 border-t-white shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  )
}

export default Loading
