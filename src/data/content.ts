export const navLinks = ['About', 'Services', 'Gallery', 'Contact']

export const brandValues = [
  'Handmade with Heart',
  'Timeless Elegance',
  'Thoughtful Details',
  'Personal Experience',
  'Meaningful Connections',
]

export interface Service {
  number: string
  name: string
}

export const services: Service[] = [
  { number: '01', name: 'Calligraphy & Hand Lettering' },
  { number: '02', name: 'Engraving & Gilding' },
  { number: '03', name: 'Personalized Gifts & Keepsakes' },
  { number: '04', name: 'Bespoke Stationery & Event Details' },
  { number: '05', name: 'Live Events & Experiences' },
]

export type GalleryCategory = 'Calligraphy' | 'Engraving' | 'Stationery' | 'Gifts' | 'Events'

export const galleryFilters: Array<'All' | GalleryCategory> = [
  'All',
  'Calligraphy',
  'Engraving',
  'Stationery',
  'Gifts',
  'Events',
]

export interface GalleryItem {
  id: string
  category: GalleryCategory
  aspect: string
}

export const galleryItems: GalleryItem[] = [
  { id: 'g1', category: 'Calligraphy', aspect: 'aspect-[3/4]' },
  { id: 'g2', category: 'Engraving', aspect: 'aspect-square' },
  { id: 'g3', category: 'Stationery', aspect: 'aspect-[4/5]' },
  { id: 'g4', category: 'Gifts', aspect: 'aspect-[3/4]' },
  { id: 'g5', category: 'Events', aspect: 'aspect-square' },
  { id: 'g6', category: 'Calligraphy', aspect: 'aspect-[4/5]' },
  { id: 'g7', category: 'Stationery', aspect: 'aspect-[3/4]' },
  { id: 'g8', category: 'Gifts', aspect: 'aspect-square' },
  { id: 'g9', category: 'Engraving', aspect: 'aspect-[4/5]' },
]

export interface ProcessStep {
  number: string
  name: string
  description: string
  align: 'left' | 'right'
}

export const processSteps: ProcessStep[] = [
  { number: '01', name: 'Inquire', description: 'Share your vision with us', align: 'left' },
  { number: '02', name: 'Collaborate', description: 'We design it together', align: 'right' },
  { number: '03', name: 'Create', description: 'Handcrafted with care and intention', align: 'left' },
  { number: '04', name: 'Deliver', description: 'Your story, beautifully told', align: 'right' },
]

export interface Testimonial {
  quote: string
  attribution: string
}

export const testimonials: Testimonial[] = [
  {
    quote: 'Every letter felt considered. What we received was more keepsake than invitation.',
    attribution: 'A. SHARMA, DELHI',
  },
  {
    quote: 'They listened to the story we wanted to tell and then told it better than we could have.',
    attribution: 'R. MENON, BENGALURU',
  },
  {
    quote: 'Handcrafted, unhurried, exact. It is rare to find all three in one place.',
    attribution: 'P. KAPOOR, MUMBAI',
  },
]

export const occasionTypes = ['Wedding', 'Corporate Event', 'Birthday', 'Anniversary', 'Other']

export const serviceOptions = services.map((service) => service.name)

/** Placeholder — swap for the real endpoint once the client provides one. */
export const formspreeEndpoint = 'https://formspree.io/f/REPLACE_ME'

export const contactInfo = {
  instagram: '@theplumingtales',
  shipping: 'Ships across India',
}
