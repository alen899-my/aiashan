"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Target, Dumbbell, Apple, Pill, Moon, TrendingUp } from 'lucide-react'

const Dashboard = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const userId = localStorage.getItem('ashan_user_id');

      if (!userId) {
        router.push('/');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/users/${userId}`, {
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Dashboard Load Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // Parse the AI plan into structured sections
  const parseAIPlan = (aiPlan: string) => {
    if (!aiPlan) return null;

    const sections = {
      overview: '',
      workoutPlan: [] as any[],
      recovery: [] as string[],
      nutrition: [] as string[],
      supplementation: [] as string[]
    };

    // Extract overview
    const overviewMatch = aiPlan.match(/### Overview\n([\s\S]*?)(?=###|$)/);
    if (overviewMatch) {
      sections.overview = overviewMatch[1].trim();
    }

    // Extract workout days
    const dayMatches = aiPlan.matchAll(/\* \*\*Day (\d+): ([^*]+)\*\*\n([\s\S]*?)(?=\* \*\*Day|###|$)/g);
    for (const match of dayMatches) {
      const dayNum = match[1];
      const dayName = match[2].trim();
      const exercises = [];
      
      const exerciseMatches = match[3].matchAll(/\+ ([^\n]+)/g);
      for (const ex of exerciseMatches) {
        exercises.push(ex[1].trim());
      }
      
      sections.workoutPlan.push({
        day: dayNum,
        name: dayName,
        exercises
      });
    }

    // Extract recovery tips
    const recoveryMatch = aiPlan.match(/### \*\*Recovery Advice\*\*\n([\s\S]*?)(?=###|$)/);
    if (recoveryMatch) {
      const recoveryItems = recoveryMatch[1].matchAll(/\* ([^\n]+)/g);
      for (const item of recoveryItems) {
        sections.recovery.push(item[1].trim());
      }
    }

    // Extract nutrition tips
    const nutritionMatch = aiPlan.match(/### \*\*Key Nutritional Tips\*\*\n([\s\S]*?)(?=###|$)/);
    if (nutritionMatch) {
      const nutritionItems = nutritionMatch[1].matchAll(/\* \*\*([^:]+)\*\*: ([^\n]+)/g);
      for (const item of nutritionItems) {
        sections.nutrition.push(`${item[1]}: ${item[2]}`);
      }
    }

    // Extract supplementation
    const suppMatch = aiPlan.match(/### \*\*Supplementation\*\*\n([\s\S]*?)(?=###|Remember|$)/);
    if (suppMatch) {
      const suppItems = suppMatch[1].matchAll(/\* \*\*([^:]+)\*\*: ([^\n]+)/g);
      for (const item of suppItems) {
        sections.supplementation.push(`${item[1]}: ${item[2]}`);
      }
    }

    return sections;
  };

  const planData = userData?.ai_plan ? parseAIPlan(userData.ai_plan) : null;

  if (loading) return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
    </div>
  );

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">
              Welcome, <span className="text-primary">{userData?.first_name || 'Warrior'}</span>
            </h1>
            <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">System Status: Optimal</p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-primary font-black text-xl italic uppercase">Level: {userData?.experience}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar: Biometrics Card */}
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md sticky top-6">
              <h3 className="text-primary font-black uppercase italic mb-4">Core Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Weight</p>
                  <p className="text-xl font-black">{userData?.weight} KG</p>
                </div>
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Height</p>
                  <p className="text-xl font-black">{userData?.height} CM</p>
                </div>
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Goal</p>
                  <p className="text-xs font-black uppercase text-primary">{userData?.goal}</p>
                </div>
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Frequency</p>
                  <p className="text-xl font-black">{userData?.frequency} Days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content: AI Workout Plan */}
          <div className="lg:col-span-2 space-y-6">
            {planData ? (
              <>
                {/* Overview Section */}
                {planData.overview && (
                  <div className="bg-white/5 border border-primary/20 p-6 rounded-3xl relative overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                        <Target className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-black uppercase italic">Mission Overview</h2>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{planData.overview}</p>
                  </div>
                )}

                {/* Workout Plan Section */}
                {planData.workoutPlan.length > 0 && (
                  <div className="bg-white/5 border border-primary/20 p-6 rounded-3xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                        <Dumbbell className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-black uppercase italic">Training Protocol</h2>
                    </div>
                    <div className="space-y-4">
                      {planData.workoutPlan.map((day: any) => (
                        <div key={day.day} className="bg-black/40 border border-white/5 p-5 rounded-2xl">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                              <span className="text-black font-black text-sm">{day.day}</span>
                            </div>
                            <h3 className="text-lg font-bold text-primary uppercase">{day.name}</h3>
                          </div>
                          <ul className="space-y-2">
                            {day.exercises.map((exercise: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                                <span className="mt-1.5 w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                                <span>{exercise}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recovery Section */}
                {planData.recovery.length > 0 && (
                  <div className="bg-white/5 border border-primary/20 p-6 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                        <Moon className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-black uppercase italic">Recovery Protocol</h2>
                    </div>
                    <ul className="space-y-3">
                      {planData.recovery.map((tip: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-300 text-sm bg-black/40 p-4 rounded-xl border border-white/5">
                          <span className="mt-1 w-2 h-2 bg-primary rounded-full shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Nutrition Section */}
                {planData.nutrition.length > 0 && (
                  <div className="bg-white/5 border border-primary/20 p-6 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                        <Apple className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-black uppercase italic">Nutrition Strategy</h2>
                    </div>
                    <ul className="space-y-3">
                      {planData.nutrition.map((tip: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-300 text-sm bg-black/40 p-4 rounded-xl border border-white/5">
                          <TrendingUp className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Supplementation Section */}
                {planData.supplementation.length > 0 && (
                  <div className="bg-white/5 border border-primary/20 p-6 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                        <Pill className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-black uppercase italic">Supplement Stack</h2>
                    </div>
                    <ul className="space-y-3">
                      {planData.supplementation.map((supp: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-300 text-sm bg-black/40 p-4 rounded-xl border border-white/5">
                          <span className="mt-1 w-2 h-2 bg-primary rounded-full shrink-0" />
                          <span>{supp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Motivational Footer */}
                <div className="bg-gradient-to-r from-primary/20 to-transparent border border-primary/30 p-6 rounded-3xl">
                  <p className="text-primary font-black text-lg italic uppercase text-center">
                    STAY FOCUSED. STAY DISCIPLINED. STAY ELITE.
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-white/5 border border-primary/20 p-8 rounded-3xl">
                <p className="text-gray-400 text-center">No strategy generated yet. Please re-sync your core.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;