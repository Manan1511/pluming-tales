// Auto-discovers images dropped into src/assets/images/<folder>/. Drop files
// in matching folders and they show up with zero code changes — filenames
// don't matter, only folder placement and the fact a file exists there.
const modules = import.meta.glob('/src/assets/images/**/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

function entriesForFolder(folder: string) {
  const prefix = `/src/assets/images/${folder}/`
  return Object.entries(modules)
    .filter(([path]) => path.startsWith(prefix))
    .sort(([a], [b]) => a.localeCompare(b))
}

export function getImage(folder: string, index = 0): string | undefined {
  return entriesForFolder(folder)[index]?.[1]
}

export function getImages(folder: string): string[] {
  return entriesForFolder(folder).map(([, url]) => url)
}
