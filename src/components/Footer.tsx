import { contactInfo } from '../data/content'

export default function Footer() {
  return (
    <footer className="bg-onyx text-alabaster py-20 px-6 text-center">
      <div className="font-medium leading-tight md:leading-none" style={{ fontSize: 'clamp(1.6rem, 5vw, 2.5rem)' }}>
        THE PLUMING TALES COMPANY
      </div>

      <p className="italic-safe text-alabaster/70 mt-6 text-xl">
        Where every stroke tells a story.
      </p>

      <p className="mt-8 font-medium tracking-[0.05em] text-[0.95rem] text-alabaster/80">
        {contactInfo.infoLine}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-medium tracking-[0.1em] text-[0.95rem]">
        <span>{contactInfo.location}</span>
        <span className="text-umber hidden sm:inline">&bull;</span>
        <a href={`mailto:${contactInfo.email}`} className="underline-grow break-all sm:break-normal">
          {contactInfo.email}
        </a>
        <span className="text-umber hidden sm:inline">&bull;</span>
        <a
          href={`https://instagram.com/${contactInfo.instagram.replace('@', '')}`}
          className="underline-grow"
          target="_blank"
          rel="noreferrer"
        >
          {contactInfo.instagram}
        </a>
      </div>

      <p className="mt-16 spaced-caps text-[0.82rem] text-alabaster/60">
        &copy; {new Date().getFullYear()} THE PLUMING TALES COMPANY
      </p>
    </footer>
  )
}
