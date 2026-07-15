export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
]

export const hero = {
  subheadline:
    'Bespoke Calligraphy, Engraving & Luxury Personalisation for Celebrations, Brands and Keepsakes.',
  paragraphs: [
    'The Pluming Tales Company is a Mumbai-based luxury personalisation studio specialising in bespoke calligraphy, hand engraving, premium stationery and elevated guest experiences for weddings, luxury brands and meaningful gifting.',
    'From handcrafted invitations and personalised keepsakes to live event activations and bespoke signage, we create thoughtful details that leave lasting impressions.',
  ],
  ctas: [
    { label: 'Explore Services', href: '#services' },
    { label: 'Enquire Now', href: '#contact' },
  ],
}

export const philosophy = {
  heading: 'Thoughtful Details. Timeless Elegance.',
  paragraphs: [
    'Luxury is found in the details.',
    'The handwritten name on an invitation, the engraving on a cherished keepsake, the shimmer of gold leaf, the personalised piece a guest carries home long after the celebration ends.',
    'At The Pluming Tales Company, we create these details with intention, artistry and care.',
    'Because the smallest details often leave the greatest impression.',
  ],
}

export const founder = {
  heading: 'Meet The Founder',
  subheading: 'The Heart Behind The Pluming Tales Company',
  paragraphs: [
    "Hi, I'm Neha Chhabria, founder and creative director of The Pluming Tales Company.",
    'My journey with calligraphy began in 2017 and evolved into a studio dedicated to bespoke craftsmanship, luxury personalisation and elevated experiences.',
    'Today, I collaborate with couples, luxury brands and businesses to create pieces that celebrate milestones, strengthen brand stories and become treasured keepsakes.',
    'With over eight years of experience across calligraphy, engraving, embossing and gilding, my focus remains simple:',
  ],
  closingLine: 'Creating beautiful details that leave lasting impressions.',
}

export const aboutStudio = {
  heading: 'The Story Behind The Pluming Tales Company',
  paragraphs: [
    'The Pluming Tales Company is a boutique luxury studio specialising in calligraphy, engraving and bespoke personalisation.',
    'Inspired by the graceful movement of a feather pen and the stories behind every handcrafted creation, the studio blends traditional craftsmanship with contemporary techniques to create elegant pieces for weddings, luxury brands and meaningful gifting experiences.',
    'Our work spans paper, glass, leather, acrylic, wood and metal, proving that beautiful craftsmanship belongs everywhere.',
  ],
}

export interface Service {
  number: string
  category: string
  slug: string
  name: string
  whatWeCreate: string
  whyItMatters: string
  chosenFor: string[]
  /** Overrides the default portrait image frame for services shot landscape. */
  imageAspect?: string
  /** Overrides the default services/<slug> image source. */
  imageFolder?: string
  imageIndex?: number
}

export const services: Service[] = [
  {
    number: '01',
    category: 'Engraving',
    slug: 'engraving',
    name: 'Hand Engraving & Surface Personalisation',
    whatWeCreate:
      'Personalised engraving across glass, metal, leather, acrylic and wood for gifting, celebrations and brand experiences.',
    whyItMatters: 'Because the most treasured objects are often the ones that carry a personal story.',
    chosenFor: [
      'Perfume Bottles',
      'Champagne & Wine Bottles',
      'Glassware & Barware',
      'Candle Jars',
      'Corporate Gifting',
      'Wedding Favours',
      'Luxury Brand Activations',
      'VIP Experiences',
      'Milestone Celebrations',
    ],
  },
  {
    number: '02',
    category: 'Embossing',
    slug: 'embossing',
    name: 'Luxury Embossing & Heat Foiling',
    whatWeCreate:
      'Premium embossing, foil stamping and monogramming for stationery, leather accessories and luxury packaging.',
    whyItMatters: 'Because tactile details communicate craftsmanship and quality before a single word is read.',
    chosenFor: [
      'Luxury Packaging',
      'Wedding Stationery',
      'Passport Covers',
      'Luggage Tags',
      'Corporate Gifting',
      'Event Collateral',
      'Personalised Accessories',
    ],
  },
  {
    number: '03',
    category: 'Invitations',
    slug: 'invitations',
    name: 'Bespoke Invitations & Paper Goods',
    whatWeCreate:
      'Invitation suites, save-the-dates, menus, place cards and wedding stationery designed to reflect your celebration.',
    whyItMatters: 'Because every memorable occasion deserves an introduction that feels just as special.',
    chosenFor: [
      'Weddings',
      'Engagement Celebrations',
      'Milestone Birthdays',
      'Private Events',
      'Corporate Events',
      'Luxury Celebrations',
      'Wedding Day Stationery',
    ],
  },
  {
    number: '04',
    category: 'Gilding',
    slug: 'gilding',
    name: 'Illuminated Gold Leaf Artwork',
    whatWeCreate: 'Hand gilded artwork using genuine 24K gold leaf and traditional techniques.',
    whyItMatters: 'Because some stories deserve to become heirlooms.',
    chosenFor: [
      'Spiritual Artwork',
      'Monograms',
      'Wedding Keepsakes',
      'Bespoke Gifts',
      'Framed Artwork',
      'Family Heirlooms',
      'Commemorative Pieces',
    ],
  },
  {
    number: '05',
    category: 'Stationery',
    slug: 'stationery',
    name: 'Bespoke Stationery & Personalised Paper Goods',
    whatWeCreate:
      'Luxury paper goods and personalised stationery designed for gifting, celebrations and everyday elegance.',
    whyItMatters: 'Because thoughtful details transform everyday essentials into cherished possessions.',
    chosenFor: [
      'Gift Tags',
      'Bookmarks',
      'Luggage Tags',
      'Passport Covers',
      'Corporate Stationery',
      'Event Favours',
      'Personalised Gifts',
      'Luxury Gifting',
    ],
  },
  {
    number: '06',
    category: 'On-Site',
    slug: 'on-site',
    name: 'Live Calligraphy & Engraving Experiences',
    whatWeCreate: 'Interactive personalisation experiences where guests watch keepsakes being created in real time.',
    whyItMatters: 'Because experiences create stronger emotional connections than products alone.',
    imageFolder: 'founder',
    imageIndex: 1,
    chosenFor: [
      'Luxury Brand Activations',
      'Retail Events',
      'Product Launches',
      'Weddings',
      'Corporate Events',
      'Store Openings',
      'Pop-Ups',
      'Influencer Events',
    ],
  },
  {
    number: '07',
    category: 'Signage',
    slug: 'signage',
    name: 'Luxury Name Plates & Bespoke Signage',
    whatWeCreate:
      'Custom name plates, welcome signage, table displays and brand installations crafted to elevate spaces and experiences.',
    whyItMatters: 'Because first impressions begin long before a conversation starts.',
    chosenFor: [
      'Luxury Residences',
      'Wedding Celebrations',
      'Hospitality Spaces',
      'Corporate Offices',
      'Retail Spaces',
      'Event Installations',
      'Brand Displays',
    ],
    imageAspect: 'aspect-[4/3]',
  },
]

export const collaborations = {
  heading: 'Trusted By Brands That Value Craftsmanship',
  paragraphs: [
    'We collaborate with luxury brands to create personalised experiences that feel thoughtful, memorable and deeply connected to their story.',
    'From on-site activations and product personalisation to bespoke gifting and premium packaging, we help brands create moments that customers remember long after the event ends.',
  ],
}

export interface WhyChooseItem {
  name: string
  description: string
}

export const whyChooseUs: WhyChooseItem[] = [
  {
    name: 'Created With Intention',
    description: 'From concept to final finish, every piece is designed with purpose and attention to detail.',
  },
  {
    name: 'Crafted Across Surfaces',
    description: 'From paper and leather to glass, acrylic, wood and metal, we bring artistry to unexpected places.',
  },
  {
    name: 'Elevated Experiences',
    description: 'Our work is designed to be experienced, remembered and shared.',
  },
  {
    name: 'Attention To Detail',
    description:
      'From concept to completion, every detail is carefully considered to ensure a seamless and elevated experience.',
  },
  {
    name: 'Luxury Through Personalisation',
    description: 'We believe the most meaningful pieces are the ones created exclusively for you.',
  },
]

export interface ProcessStep {
  number: string
  name: string
  description: string
  align: 'left' | 'right'
  imageFolder: string
  imageIndex?: number
}

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    name: 'Inquire',
    description: 'Share your vision with us',
    align: 'left',
    imageFolder: 'services/stationery',
  },
  {
    number: '02',
    name: 'Collaborate',
    description: 'We design it together',
    align: 'right',
    imageFolder: 'services/gilding',
  },
  {
    number: '03',
    name: 'Create',
    description: 'Handcrafted with care and intention',
    align: 'left',
    imageFolder: 'founder',
  },
  {
    number: '04',
    name: 'Deliver',
    description: 'Your story, beautifully told',
    align: 'right',
    imageFolder: 'about',
  },
]

export interface Testimonial {
  quote: string
  attribution: string
}

export const testimonials: Testimonial[] = [
  {
    quote:
      'The engraved glasses created by The Pluming Tales Company became one of our most appreciated Diwali gifts. Beautifully crafted and thoughtfully personalised, they left a lasting impression on our clients.',
    attribution: 'ITALITE',
  },
  {
    quote:
      'I absolutely loved the engraved wedding monogram glasses created by The Pluming Tales Company. They were thoughtful, elegant and added such a personal touch for our friends celebrations. The final pieces were beautifully executed and exactly what we had envisioned.',
    attribution: 'RAINA BHATIJA',
  },
  {
    quote:
      'From our custom monogram to the calligraphy details on our Save the Date, every element felt uniquely ours. The process was seamless from start to finish and the final result exceeded our expectations.',
    attribution: 'PIHU MATA',
  },
]

export const enquiry = {
  heading: "Let's Create Something Beautiful Together",
  paragraphs: [
    "Whether you're planning a wedding, organising a brand activation or looking for a personalised keepsake, we'd love to hear your story.",
    "Share a few details below and we'll be in touch to bring your vision to life.",
  ],
  submitLabel: 'Start Your Story →',
}

export const serviceOptions = services.map((service) => service.name)

/** Placeholder — swap for the real endpoint once the client provides one. */
export const formspreeEndpoint = 'https://formspree.io/f/REPLACE_ME'

export const contactInfo = {
  instagram: '@theplumingtales',
  location: 'Mumbai, India',
  email: 'theplumingtales@gmail.com',
  infoLine: 'Luxury Calligraphy · Engraving · Bespoke Stationery · On-Site Experiences',
}
