// Auto-discovers videos dropped into src/assets/videos/<folder>/, mirroring
// lib/images.ts — drop a file in a matching folder and it shows up with zero
// code changes.
const modules = import.meta.glob('/src/assets/videos/**/*.mp4', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const posterModules = import.meta.glob('/src/assets/videos/**/*-poster.jpg', {
  eager: true,
  import: 'default',
}) as Record<string, string>

export function getVideo(folder: string): string | undefined {
  const prefix = `/src/assets/videos/${folder}/`
  const entry = Object.entries(modules).find(([path]) => path.startsWith(prefix))
  return entry?.[1]
}

/** First-frame still, shown while the video buffers so the slot is never blank. */
export function getVideoPoster(folder: string): string | undefined {
  const prefix = `/src/assets/videos/${folder}/`
  const entry = Object.entries(posterModules).find(([path]) => path.startsWith(prefix))
  return entry?.[1]
}
