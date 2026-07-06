import { contactInfo } from '../data/content'

export default function Footer() {
  return (
    <footer className="bg-onyx text-alabaster py-20 px-6 text-center">
      <div className="font-medium text-[2.5rem] leading-none">THE PLUMING TALES COMPANY</div>

      <p className="italic-safe text-alabaster/70 mt-6 text-xl">
        Where every stroke tells a story.
      </p>

      <p className="mt-8 font-medium tracking-[0.05em] text-[0.85rem] text-alabaster/80">
        {contactInfo.infoLine}
      </p>

      <p className="mt-6 font-medium tracking-[0.1em] text-[0.85rem]">
        <span>{contactInfo.location}</span>
        <span className="mx-3 text-umber">&bull;</span>
        <a href={`mailto:${contactInfo.email}`} className="underline-grow">
          {contactInfo.email}
        </a>
        <span className="mx-3 text-umber">&bull;</span>
        <a
          href={`https://instagram.com/${contactInfo.instagram.replace('@', '')}`}
          className="underline-grow"
          target="_blank"
          rel="noreferrer"
        >
          {contactInfo.instagram}
        </a>
      </p>

      <p className="mt-16 spaced-caps text-[0.7rem] text-alabaster/40">
        &copy; {new Date().getFullYear()} THE PLUMING TALES COMPANY
      </p>
    </footer>
  )
}
