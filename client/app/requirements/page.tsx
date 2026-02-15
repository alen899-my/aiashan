import React from 'react'
import Image from 'next/image'
import AskDetail from '@/components/userdetails/AskDetail'

export default function RequirementsPage() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Background Illustration */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/illustration.jpg"
          alt="Training Illustration"
          fill
          priority
          quality={100}
          className="object-cover opacity-50"
        />
        {/* Dark Red/Black Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/20 to-black z-10" />
      </div>

      {/* Onboarding UI */}
      <div className="relative z-20 w-full px-6 py-10 flex flex-col items-center">
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
            INITIALIZE <span className="text-primary ">Plan</span>
          </h1>
         
        </div>

        <AskDetail />
      </div>
    </main>
  )
}