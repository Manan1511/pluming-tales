import PlaceholderImage from './PlaceholderImage'
import { getImage } from '../lib/images'

interface SmartImageProps {
  folder: string
  index?: number
  alt: string
  className?: string
  tone?: 'oatmere' | 'umber'
}

/** Renders a real photo from src/assets/images/<folder>/ if one exists, else a placeholder. */
export default function SmartImage({ folder, index = 0, alt, className = '', tone }: SmartImageProps) {
  const src = getImage(folder, index)

  if (!src) return <PlaceholderImage className={className} tone={tone} />

  return <img src={src} alt={alt} className={`${className} object-cover`} />
}
