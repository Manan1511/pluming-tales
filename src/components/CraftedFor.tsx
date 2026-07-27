import { IconFeather, IconFlower, IconGift, IconShieldStar } from '@tabler/icons-react'
import ScrollReveal from './ScrollReveal'
import { craftedFor, type CraftedForItem } from '../data/content'

const ICONS: Record<CraftedForItem['icon'], typeof IconFlower> = {
  flower: IconFlower,
  shield: IconShieldStar,
  gift: IconGift,
  feather: IconFeather,
}

export default function CraftedFor() {
  return (
    <section className="bg-alabaster px-6 md:px-12 py-24 border-b border-umber/10">
      <ScrollReveal>
        <span className="block spaced-caps !font-bold text-[1.3rem] tracking-[0.2em] text-onyx text-center mb-14">
          Crafted For
        </span>
        <div className="grid grid-cols-2 md:flex md:flex-wrap justify-center md:divide-x divide-umber/15 gap-y-14 md:gap-y-0">
          {craftedFor.map((item) => {
            const Icon = ICONS[item.icon]
            return (
              <div key={item.label} className="flex flex-col items-center gap-4 px-6 md:px-16">
                <Icon size={44} strokeWidth={1.25} className="text-umber" />
                <span className="spaced-caps text-[1.05rem]">{item.label}</span>
              </div>
            )
          })}
        </div>
      </ScrollReveal>
    </section>
  )
}
