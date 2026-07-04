interface PlaceholderImageProps {
  className?: string
  tone?: 'oatmere' | 'umber'
}

/** Stand-in for a real photo. Swap for an <img> once real assets exist. */
export default function PlaceholderImage({ className = '', tone = 'oatmere' }: PlaceholderImageProps) {
  const bg = tone === 'umber' ? 'bg-umber/25' : 'bg-oatmere'
  return <div className={`${bg} ${className}`} aria-hidden="true" />
}
