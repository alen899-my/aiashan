"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RedButton } from '@/components/common/Button'

const AskDetail = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // State for all form fields
  const [formData, setFormData] = useState({
    first_name: '',
    email: '',
    phone: '',
    password: '',
    age: '',
    height: '',
    weight: '',
    goal: '',
    experience: '',
    frequency: ''
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle direct value selection (for Goal and Experience buttons)
  const setDirectValue = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // Logic to call the Backend (FastAPI + Grok)
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          frequency: parseInt(formData.frequency)
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Save user ID for the dashboard to fetch
        localStorage.setItem('ashan_user_id', data.id);
        alert(`Welcome ${data.first_name}! AI Ashan is calculating your personalized plan...`);
        router.push('/dashboard');
      } else {
        alert("Failed to register. Please try again.");
      }
    } catch (error) {
      console.error("Connection Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="text-center animate-pulse">
      <h2 className="text-white text-2xl font-black italic">AI ASHAN IS ANALYZING...</h2>
      <p className="text-primary text-xs tracking-widest mt-2 uppercase">Generating your custom algorithm</p>
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      {/* Progress Bar */}
      <div className="flex justify-between items-center mb-10">
        <span className="text-primary font-black uppercase tracking-widest text-[10px]">Step {step} / 3</span>
        <div className="flex gap-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-1 w-10 rounded-full transition-all duration-500 ${step >= i ? 'bg-primary' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>

      <div className="min-h-[320px] flex flex-col justify-between">
        <div className="space-y-6">
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Basic Info</h2>
              <div className="space-y-3">
                <input name="first_name" value={formData.first_name} onChange={handleChange} type="text" placeholder="First Name" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:border-primary outline-none transition-all placeholder:text-gray-600" />
                <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Email Address" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:border-primary outline-none transition-all placeholder:text-gray-600" />
                <input name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="Phone Number" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:border-primary outline-none transition-all placeholder:text-gray-600" />
                <input name="password" value={formData.password} onChange={handleChange} type="password" placeholder="Password" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:border-primary outline-none transition-all placeholder:text-gray-600" />
              </div>
            </div>
          )}

          {/* STEP 2: Body Metrics */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Body Metrics</h2>
              <div className="space-y-3">
                <input name="age" value={formData.age} onChange={handleChange} type="number" placeholder="Age" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-primary" />
                <div className="flex gap-3">
                  <input name="height" value={formData.height} onChange={handleChange} type="text" placeholder="Height (cm)" className="w-1/2 bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-primary" />
                  <input name="weight" value={formData.weight} onChange={handleChange} type="text" placeholder="Weight (kg)" className="w-1/2 bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-primary" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Objectives */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Objectives</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2 block">Select Goal</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Weight Gain', 'Build Muscle', 'Lose Weight', 'Maintain'].map((goal) => (
                      <button
                        key={goal}
                        onClick={() => setDirectValue('goal', goal)}
                        className={`py-3 px-2 rounded-xl border transition-all text-xs font-bold uppercase active:scale-95 ${formData.goal === goal ? 'border-primary bg-primary text-white' : 'border-white/10 bg-white/5 text-white'}`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2 block">Experience Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setDirectValue('experience', level)}
                        className={`py-3 rounded-xl border transition-all text-[10px] font-black uppercase active:scale-95 ${formData.experience === level ? 'border-primary bg-primary text-white' : 'border-white/10 bg-white/5 text-white'}`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                <input name="frequency" value={formData.frequency} onChange={handleChange} type="number" placeholder="Workout Days / Week" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-primary" />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Actions */}
        <div className="flex gap-4 pt-8">
          {step > 1 && (
            <button onClick={prevStep} className="w-1/3 text-white font-bold uppercase tracking-widest text-[10px] border border-white/10 rounded-xl hover:bg-white/5">
              Back
            </button>
          )}
          <RedButton
            onClick={step === 3 ? handleSubmit : nextStep}
            className="flex-1 py-4 text-xs tracking-widest"
          >
            {step === 3 ? (loading ? 'Processing...' : 'Find Ashan') : 'Next'}
          </RedButton>
        </div>
      </div>
    </div>
  )
}

export default AskDetail