import { contactInfo } from '../data/content'

export default function Footer() {
  return (
    <footer className="bg-onyx text-alabaster py-20 px-6 text-center">
      <div className="font-medium text-[2.5rem] leading-none">THE PLUMING TALES COMPANY</div>

      <p className="italic-safe text-alabaster/70 mt-6 text-xl">
        Where every stroke tells a story.
      </p>

      <p className="mt-8 text-[0.75rem] tracking-[0.15em]">
        <a
          href={`https://instagram.com/${contactInfo.instagram.replace('@', '')}`}
          className="underline-grow"
          target="_blank"
          rel="noreferrer"
        >
          {contactInfo.instagram}
        </a>
        <span className="mx-3 text-umber">&bull;</span>
        <span>{contactInfo.shipping}</span>
      </p>

      <p className="mt-16 text-[0.6rem] tracking-[0.2em] text-alabaster/40">
        &copy; {new Date().getFullYear()} THE PLUMING TALES COMPANY
      </p>
    </footer>
  )
}
