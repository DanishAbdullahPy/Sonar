'use client';
import DashboardWelcome from './components/DashboardWelcome';
import { useFirebaseUser } from "@/lib/useFirebaseUser"; // <-- your new hook
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, loading } = useFirebaseUser();
  const router = useRouter();

  if (loading) return <div>Loading...</div>;
  if (!user) {
    router.replace("/login"); // or wherever your login page is
    return null;
  }

  return (
   <main className="relative px-4 pt-24 pb-8 max-w-7xl mx-auto flex flex-col gap-16 overflow-hidden">
  {/* Animated space background */}
  <div className="fixed inset-0 -z-10">
    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a] via-[#151b2c] to-[#1a2332]"></div>
    
    {/* Animated stars */}
    <div className="absolute inset-0">
      {Array.from({ length: 100 }).map((_, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full animate-pulse"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 3}px`,
            height: `${Math.random() * 3}px`,
            opacity: Math.random() * 0.8 + 0.2,
            animationDuration: `${Math.random() * 3 + 2}s`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}
    </div>
    
    {/* Nebula effect */}
    <div className="absolute inset-0 opacity-30">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
    </div>
  </div>

  <DashboardWelcome user={user} />
  
  {/* Enhanced Card Grid/Quick Navs */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
    <a 
      href="/dashboard/neo" 
      className="group relative bg-[#151b2c]/80 backdrop-blur-md border border-gray-800 hover:border-blue-500/50 rounded-2xl shadow-xl hover:shadow-2xl p-8 text-center flex flex-col gap-4 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
    >
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      {/* Icon with glow effect */}
      <div className="relative z-10">
        <span className="text-4xl transition-transform group-hover:scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">☄️</span>
      </div>
      
      <div className="relative z-10">
        <b className="text-xl font-bold text-white">Asteroids</b>
        <p className="text-gray-300 text-sm mt-1">Explore NEOs detected today</p>
      </div>
      
      {/* Hover indicator */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
    </a>
    
    <a 
      href="/dashboard/mars" 
      className="group relative bg-[#151b2c]/80 backdrop-blur-md border border-gray-800 hover:border-red-500/50 rounded-2xl shadow-xl hover:shadow-2xl p-8 text-center flex flex-col gap-4 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      <div className="relative z-10">
        <span className="text-4xl transition-transform group-hover:scale-110 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">🚗</span>
      </div>
      
      <div className="relative z-10">
        <b className="text-xl font-bold text-white">Mars Feed</b>
        <p className="text-gray-300 text-sm mt-1">View latest Mars rover images</p>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
    </a>
    
    <a 
      href="/dashboard/space-weather" 
      className="group relative bg-[#151b2c]/80 backdrop-blur-md border border-gray-800 hover:border-yellow-500/50 rounded-2xl shadow-xl hover:shadow-2xl p-8 text-center flex flex-col gap-4 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      <div className="relative z-10">
        <span className="text-4xl transition-transform group-hover:scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">🌞</span>
      </div>
      
      <div className="relative z-10">
        <b className="text-xl font-bold text-white">Space Weather</b>
        <p className="text-gray-300 text-sm mt-1">Track solar flares and CMEs</p>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
    </a>
    
    <a 
      href="/dashboard/starlog" 
      className="group relative bg-[#151b2c]/80 backdrop-blur-md border border-gray-800 hover:border-purple-500/50 rounded-2xl shadow-xl hover:shadow-2xl p-8 text-center flex flex-col gap-4 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      <div className="relative z-10">
        <span className="text-4xl transition-transform group-hover:scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">⭐</span>
      </div>
      
      <div className="relative z-10">
        <b className="text-xl font-bold text-white">Star Log</b>
        <p className="text-gray-300 text-sm mt-1">Your saved discoveries</p>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
    </a>
  </div>
</main>

  );
}
