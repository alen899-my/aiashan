import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { RedButton } from '@/components/common/Button'

export const HomeComponent = () => {
  return (
    <section className="relative w-full h-screen flex items-end md:items-center overflow-hidden bg-black">
      {/* --- Desktop Image --- */}
      <div className="hidden md:block absolute inset-0 z-0">
        <Image
          src="/images/coverintro.jpg"
          alt="Gym Trainer Desktop"
          fill
          priority
          quality={90}
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* --- Mobile Image --- */}
      <div className="block md:hidden absolute inset-0 z-0">
        <Image
          src="/images/mobilecover.jpg"
          alt="Gym Trainer Mobile"
          fill
          priority
          quality={80}
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* --- Responsive Overlay --- */}
      {/* Mobile: Stronger bottom fade for App-look | Desktop: Right fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent md:bg-gradient-to-l md:from-black/70 md:via-black/20 md:to-transparent z-10" />

      {/* Content Container */}
      <div className="relative z-20 container mx-auto px-6 mb-12 md:mb-0 flex justify-center md:justify-end">
        <div className="max-w-2xl text-center md:text-right flex flex-col items-center md:items-end">
          <h1 className="text-6xl md:text-8xl font-black text-white uppercase leading-none tracking-tighter">
            Ai <span className="text-primary">Ashan</span>
          </h1>
          
          <p className="text-gray-300 mt-4 text-base md:text-xl font-medium max-w-sm md:max-w-lg">
            Hire your personal trainer, powered by AI, to achieve your fitness goals with personalized workout plans and real-time feedback.
          </p>
          
          <div className="mt-8 w-full md:w-auto">
            <Link href="/requirements" className="w-full block md:inline-block">
              <RedButton className="w-full md:w-auto py-5 text-lg">
                Hire Your Ashan
              </RedButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}