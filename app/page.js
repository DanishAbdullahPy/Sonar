"use client";
import Head from "next/head";
import { useState, useEffect, useRef } from "react";

export default function Landing() {
  const [loaded, setLoaded] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 800);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Update current section based on scroll position
      const sections = sectionRefs.map(ref => ref.current).filter(Boolean);
      const currentIndex = sections.findIndex((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
      });
      
      if (currentIndex !== -1) {
        setCurrentSection(currentIndex);
      }

      // Intersection observer for animations
      sections.forEach((section, index) => {
        if (section) {
          const rect = section.getBoundingClientRect();
          const isInView = rect.top < window.innerHeight && rect.bottom > 0;
          setIsVisible(prev => ({ ...prev, [index]: isInView }));
        }
      });
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    handleScroll(); // Initial call
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Enhanced Navigation with labels
  const Navigation = () => (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 flex flex-col space-y-4">
      {['Home', 'Features', 'Earth', 'Technology', 'Contact'].map((label, index) => (
        <div key={index} className="group relative">
          <button
            onClick={() => {
              const section = sectionRefs[index].current;
              if (section) {
                section.scrollIntoView({ behavior: "smooth" });
                setCurrentSection(index);
              }
            }}
            className={`w-4 h-4 rounded-full transition-all duration-500 hover:scale-150 group-hover:shadow-2xl ${
              currentSection === index
                ? "bg-gradient-to-r from-cyan-400 to-blue-500 w-10 rounded-full shadow-lg shadow-cyan-500/50 animate-pulse"
                : "bg-gray-600/70 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-blue-500"
            }`}
            aria-label={`Navigate to ${label}`}
          />
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap border border-cyan-500/30">
            {label}
          </div>
        </div>
      ))}
    </div>
  );

  // Floating particles component
  const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${10 + Math.random() * 20}s`
          }}
        />
      ))}
    </div>
  );

  // Enhanced Hero Section
  const HeroSection = () => (
    <section
      ref={sectionRefs[0]}
      className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 via-indigo-900/20 to-black"
    >
      {/* Dynamic background */}
      <div className="absolute inset-0 z-0">
        <div className="stars absolute inset-0 opacity-70" />
        <FloatingParticles />
        <div 
          className="absolute inset-0 bg-gradient-to-br from-transparent via-cyan-900/10 to-purple-900/20"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
          }}
        />
      </div>
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-6xl mx-auto px-6 py-20">
        <div className={`transform transition-all duration-1500 ${loaded ? "translate-y-0 opacity-100" : "translate-y-32 opacity-0"}`}>
          {/* Enhanced badge */}
          <div className="mb-8 inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-md border border-cyan-500/30 rounded-full text-cyan-300 text-sm font-semibold tracking-wider shadow-lg shadow-cyan-500/20" style={{ fontFamily: "Rajdhani, sans-serif" }}>
            <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mr-3 animate-pulse"></div>
            🚀 NEXT-GENERATION SPACE TECHNOLOGY PLATFORM
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight mb-8 leading-none" style={{ fontFamily: "Audiowide, sans-serif" }}>
            <span className="block bg-gradient-to-r from-slate-100 via-slate-300 via-gray-200 to-slate-400 bg-clip-text text-transparent tracking-wider animate-gradient-x silver-glow">
              SPACE DASHBOARD
            </span>
            <span className="block text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mt-4 bg-gradient-to-r from-slate-400 via-gray-300 to-slate-500 bg-clip-text text-transparent font-bold tracking-wide leading-relaxed" style={{ fontFamily: "Michroma, sans-serif" }}>
              ◆ ASTEROID COMMAND CENTER ◆
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed font-medium silver-text" style={{ fontFamily: "Saira Condensed, sans-serif" }}>
            The ultimate asteroid tracking and space exploration command center featuring 
            <span className="text-slate-200 font-bold silver-highlight"> precision orbital mechanics</span>, 
            <span className="text-gray-200 font-bold silver-highlight"> real-time collision detection</span>, and 
            <span className="text-slate-100 font-bold silver-highlight"> deep space surveillance</span> capabilities.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
            <a
              href="/signup"
              className="group px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-lg transition-all duration-500 hover:scale-110 shadow-2xl hover:shadow-cyan-500/30 transform hover:-translate-y-1"
            >
              <span className="flex items-center justify-center gap-3">
                🚀 Launch Dashboard
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </a>
            <a
              href="#features"
              className="group px-10 py-5 bg-transparent border-2 border-cyan-500/50 text-cyan-300 hover:text-white hover:border-cyan-400 hover:bg-cyan-500/10 font-bold rounded-xl text-lg transition-all duration-500 hover:scale-110 backdrop-blur-sm"
            >
              <span className="flex items-center justify-center gap-3">
                🌌 Explore Features
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </a>
          </div>
          
          {/* Enhanced feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { 
                icon: "🛰️", 
                title: "Real-time Tracking", 
                desc: "Monitor 5000+ satellites with precision orbital data",
                color: "from-cyan-500/20 to-blue-500/20",
                border: "border-cyan-500/30"
              },
              { 
                icon: "🌍", 
                title: "Earth Observation", 
                desc: "Ultra-high resolution imagery & climate analytics",
                color: "from-green-500/20 to-blue-500/20",
                border: "border-green-500/30"
              },
              { 
                icon: "🌌", 
                title: "Deep Space Explorer", 
                desc: "Journey beyond our solar system with AI guidance",
                color: "from-purple-500/20 to-pink-500/20",
                border: "border-purple-500/30"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className={`bg-gradient-to-br ${feature.color} backdrop-blur-md border ${feature.border} rounded-2xl p-6 hover:scale-105 transition-all duration-500 hover:shadow-2xl group cursor-pointer`}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors" style={{ fontFamily: "Exo 2, sans-serif" }}>{feature.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed" style={{ fontFamily: "Space Grotesk, sans-serif" }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Enhanced scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center animate-bounce">
          <div className="text-cyan-400 text-sm mb-2 font-medium">Scroll to explore</div>
          <div className="w-8 h-12 rounded-full border-2 border-cyan-400/50 flex justify-center p-2">
            <div className="w-1 h-4 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );

  // Enhanced Features Section
  const FeaturesSection = () => (
    <section
      ref={sectionRefs[1]}
      id="features"
      className="min-h-screen w-full relative flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-[url('/astro.jpg')] bg-cover bg-center bg-fixed" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/50" />
      <FloatingParticles />
      
      <div className="relative z-20 max-w-7xl mx-auto px-6 py-24">
        <div className={`text-center mb-20 transform transition-all duration-1000 ${isVisible[1] ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}>
          <div className="mb-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-md border border-orange-500/30 rounded-full text-orange-300 text-sm font-semibold">
            ⚡ ADVANCED CAPABILITIES
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-8 text-white tracking-wide leading-tight" style={{ fontFamily: "Orbitron, sans-serif" }}>
            <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
              PROFESSIONAL SPACE TECHNOLOGY
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-medium" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Cutting-edge tools and analytics powered by AI for space exploration, research, and real-time monitoring.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: "🛰️",
              title: "Satellite Constellation Tracking",
              description: "Real-time monitoring of 5000+ active satellites with precision orbital mechanics, collision prediction algorithms, and automated alert systems.",
              features: ["Live 3D positioning", "Orbital decay analysis", "Collision risk assessment", "Mission timeline tracking"],
              color: "from-cyan-500/10 to-blue-500/10",
              border: "border-cyan-500/30"
            },
            {
              icon: "🌍",
              title: "Earth Intelligence Platform",
              description: "Ultra-high resolution Earth imagery with AI-powered environmental analysis, climate pattern recognition, and predictive modeling.",
              features: ["4K satellite imagery", "Climate change tracking", "Weather pattern analysis", "Environmental monitoring"],
              color: "from-green-500/10 to-emerald-500/10",
              border: "border-green-500/30"
            },
            {
              icon: "🚀",
              title: "Mission Control Center",
              description: "Advanced trajectory calculations, mission optimization algorithms, and real-time spacecraft monitoring with predictive analytics.",
              features: ["Trajectory optimization", "Fuel efficiency analysis", "Risk assessment AI", "Mission success prediction"],
              color: "from-orange-500/10 to-red-500/10",
              border: "border-orange-500/30"
            },
            {
              icon: "🔭",
              title: "Deep Space Observatory Network",
              description: "Access to global telescope networks for deep space observation, exoplanet discovery, and cosmic event monitoring.",
              features: ["Galaxy mapping", "Exoplanet detection", "Cosmic event alerts", "Stellar classification"],
              color: "from-purple-500/10 to-pink-500/10",
              border: "border-purple-500/30"
            },
            {
              icon: "☀️",
              title: "Space Weather Intelligence",
              description: "Advanced solar activity monitoring, space weather prediction, and radiation impact assessment for Earth and spacecraft.",
              features: ["Solar flare prediction", "Radiation level monitoring", "Magnetic field analysis", "Aurora forecasting"],
              color: "from-yellow-500/10 to-orange-500/10",
              border: "border-yellow-500/30"
            },
            {
              icon: "🧪",
              title: "Research Collaboration Hub",
              description: "Global platform for space research collaboration, data sharing, and scientific discovery with blockchain verification.",
              features: ["Secure data sharing", "Research collaboration", "Publication platform", "Peer review system"],
              color: "from-indigo-500/10 to-purple-500/10",
              border: "border-indigo-500/30"
            }
          ].map((feature, index) => (
            <div
              key={index}
              className={`group bg-gradient-to-br ${feature.color} backdrop-blur-md border ${feature.border} rounded-2xl p-8 hover:scale-105 transition-all duration-500 hover:shadow-2xl cursor-pointer transform ${isVisible[1] ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors" style={{ fontFamily: "Exo 2, sans-serif" }}>{feature.title}</h3>
              <p className="text-gray-300 mb-6 text-base leading-relaxed" style={{ fontFamily: "Space Grotesk, sans-serif" }}>{feature.description}</p>
              <ul className="space-y-2">
                {feature.features.map((item, i) => (
                  <li key={i} className="flex items-center text-sm text-cyan-300">
                    <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mr-3"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // Enhanced Earth Section
  const EarthSection = () => (
    <section
      ref={sectionRefs[2]}
      className="min-h-screen w-full relative flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-[url('/earth.jpg')] bg-cover bg-center bg-fixed" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
      
      <div className="relative z-20 max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className={`transform transition-all duration-1000 ${isVisible[2] ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"}`}>
          <div className="bg-black/70 backdrop-blur-md rounded-3xl p-10 border border-cyan-500/30 shadow-2xl">
            <div className="mb-6 inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-green-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full text-blue-300 text-sm font-semibold">
              🌍 EARTH INTELLIGENCE
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black mb-8 text-white leading-tight" style={{ fontFamily: "Orbitron, sans-serif" }}>
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                PLANETARY MONITORING SYSTEM
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-10 leading-relaxed" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Monitor our planet's vital signs through advanced satellite constellation imagery and environmental data analysis. 
              Track climate patterns, weather systems, and environmental changes with unprecedented precision and AI-powered insights.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-10">
              {[
                { value: "71%", label: "Ocean Coverage", icon: "🌊", color: "text-blue-400" },
                { value: "510M", label: "km² Surface Area", icon: "🗺️", color: "text-green-400" },
                { value: "12,742", label: "km Diameter", icon: "📏", color: "text-purple-400" },
                { value: "24h", label: "Rotation Period", icon: "🔄", color: "text-orange-400" }
              ].map((stat, index) => (
                <div key={index} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:scale-105 transition-all duration-300 group">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">{stat.icon}</span>
                    <div className={`text-3xl font-black ${stat.color} mb-1`}>{stat.value}</div>
                  </div>
                  <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#technology"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-xl"
              >
                🔬 Explore Earth Data
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              
              <a
                href="/climate-dashboard"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent border-2 border-green-500/50 text-green-300 hover:text-white hover:border-green-400 hover:bg-green-500/10 font-bold rounded-xl transition-all duration-300 hover:scale-105"
              >
                📊 Climate Dashboard
              </a>
            </div>
          </div>
        </div>
        
        <div className={`hidden lg:block transform transition-all duration-1000 ${isVisible[2] ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"}`}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl"></div>
            <img 
              src="/alan.gif" 
              alt="Earth Animation" 
              className="relative w-full max-w-lg mx-auto rounded-3xl shadow-2xl border border-cyan-500/30"
            />
            <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
              🔴 LIVE DATA
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // New Technology Showcase Section
  const TechnologySection = () => (
    <section
      ref={sectionRefs[3]}
      id="technology"
      className="min-h-screen w-full relative flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black"
    >
      <FloatingParticles />
      
      <div className="relative z-20 max-w-7xl mx-auto px-6 py-24">
        <div className={`text-center mb-20 transform transition-all duration-1000 ${isVisible[3] ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}>
          <div className="mb-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-purple-500/30 rounded-full text-purple-300 text-sm font-semibold">
            🔬 CUTTING-EDGE TECHNOLOGY
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-8 text-white tracking-wide leading-tight" style={{ fontFamily: "Orbitron, sans-serif" }}>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              AI-POWERED SPACE INTELLIGENCE
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className={`transform transition-all duration-1000 ${isVisible[3] ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"}`}>
            <div className="space-y-8">
              {[
                {
                  icon: "🤖",
                  title: "Machine Learning Analytics",
                  description: "Advanced AI algorithms process terabytes of space data in real-time, identifying patterns and anomalies invisible to human analysis."
                },
                {
                  icon: "⚡",
                  title: "Quantum Computing Integration",
                  description: "Leverage quantum processors for complex orbital calculations and deep space trajectory optimization with unprecedented speed."
                },
                {
                  icon: "🔮",
                  title: "Predictive Space Weather",
                  description: "AI-powered forecasting models predict solar storms, radiation events, and their impact on Earth's technology infrastructure."
                }
              ].map((tech, index) => (
                <div key={index} className="flex items-start gap-6 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/30 rounded-2xl hover:scale-105 transition-all duration-300">
                  <div className="text-4xl">{tech.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "Exo 2, sans-serif" }}>{tech.title}</h3>
                    <p className="text-gray-300 leading-relaxed" style={{ fontFamily: "Space Grotesk, sans-serif" }}>{tech.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`transform transition-all duration-1000 ${isVisible[3] ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"}`}>
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-purple-500/30 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: "Orbitron, sans-serif" }}>REAL-TIME METRICS</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Satellites Tracked", value: "5,247", trend: "+12%" },
                  { label: "Data Points/sec", value: "847K", trend: "+8%" },
                  { label: "AI Predictions", value: "99.7%", trend: "+0.3%" },
                  { label: "Global Users", value: "127K", trend: "+24%" }
                ].map((metric, index) => (
                  <div key={index} className="bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-purple-500/20">
                    <div className="text-2xl font-black text-purple-400 mb-1">{metric.value}</div>
                    <div className="text-xs text-gray-400 mb-1">{metric.label}</div>
                    <div className="text-xs text-green-400 font-semibold">{metric.trend}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Enhanced Final CTA Section
  const CTASection = () => (
    <section
      ref={sectionRefs[4]}
      className="min-h-screen w-full relative flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-[url('/rocket.jpg')] bg-cover bg-center bg-fixed" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/40" />
      <FloatingParticles />
      
      <div className="relative z-20 max-w-5xl mx-auto px-6 py-24 text-center">
        <div className={`transform transition-all duration-1000 ${isVisible[4] ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}>
          <div className="mb-8 inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-md border border-orange-400/30 rounded-full text-orange-300 text-sm font-bold">
            <span className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mr-3 animate-pulse"></span>
            🚀 MISSION READY • LAUNCH SEQUENCE INITIATED
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black mb-10 text-white leading-tight" style={{ fontFamily: "Orbitron, sans-serif" }}>
            <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
              BEGIN YOUR SPACE ODYSSEY
            </span>
          </h2>
          
          <p className="text-2xl md:text-3xl text-gray-300 mb-16 leading-relaxed max-w-4xl mx-auto" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Join <span className="text-cyan-400 font-bold">127,000+</span> researchers, scientists, and space enthusiasts exploring the cosmos with cutting-edge technology.
            <br />
            <span className="text-lg text-blue-300 font-medium">🛰️ Professional Tools • 📡 Real-time Data • 🌍 Global Community • 🤖 AI-Powered Insights</span>
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-8 mb-16">
            <a
              href="/signup"
              className="group px-12 py-6 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-400 hover:via-red-400 hover:to-pink-400 text-white font-black rounded-2xl text-xl shadow-2xl hover:shadow-orange-500/30 transition-all duration-500 hover:scale-110 transform hover:-translate-y-2"
            >
              <span className="flex items-center justify-center gap-4">
                🚀 LAUNCH MISSION
                <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </a>
            
            <a
              href="/dashboard"
              className="group px-12 py-6 bg-transparent border-3 border-cyan-500/50 text-cyan-300 hover:text-white hover:border-cyan-400 hover:bg-cyan-500/10 font-black rounded-2xl text-xl transition-all duration-500 hover:scale-110 backdrop-blur-sm"
            >
              <span className="flex items-center justify-center gap-4">
                🌌 EXPLORE DASHBOARD
                <svg className="w-6 h-6 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </span>
            </a>
          </div>
          
          <div className="text-center">
            <p className="text-gray-500 mb-6 text-lg font-medium">Trusted by leading space organizations worldwide</p>
            <div className="flex justify-center items-center gap-12 opacity-70 text-lg font-bold">
              <span className="hover:text-cyan-400 transition-colors cursor-pointer">🇺🇸 NASA</span>
              <span className="hover:text-cyan-400 transition-colors cursor-pointer">🇪🇺 ESA</span>
              <span className="hover:text-cyan-400 transition-colors cursor-pointer">🇯🇵 JAXA</span>
              <span className="hover:text-cyan-400 transition-colors cursor-pointer">🚀 SpaceX</span>
              <span className="hover:text-cyan-400 transition-colors cursor-pointer">🛰️ Blue Origin</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=Exo+2:wght@300;400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700;800;900&family=Audiowide:wght@400&family=Michroma:wght@400&family=Saira+Condensed:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <title>Space Dashboard - Next-Generation Space Exploration Platform | AI-Powered Satellite Tracking</title>
        <meta name="description" content="Professional space exploration platform with AI-powered satellite tracking, real-time Earth monitoring, deep space observation, and quantum-enhanced analytics for researchers and space enthusiasts." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0891b2" />
        <meta property="og:title" content="Space Dashboard - Next-Generation Space Technology" />
        <meta property="og:description" content="Explore the cosmos with AI-powered tools, real-time satellite tracking, and advanced space analytics." />
        <meta property="og:type" content="website" />
      </Head>
      
      <Navigation />
      
      <main className="w-full bg-black overflow-x-hidden" style={{ fontFamily: "'Space Grotesk', sans-serif", scrollSnapType: "y mandatory", lineHeight: "1.7" }}>
        <HeroSection />
        <FeaturesSection />
        <EarthSection />
        <TechnologySection />
        <CTASection />
      </main>

      <style jsx global>{`
        html { 
          scroll-behavior: smooth; 
          overflow-x: hidden;
        }
        
        body {
          overflow-x: hidden;
        }
        
        section { 
          scroll-snap-align: start; 
        }
        
        /* Enhanced animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(5px) rotate(240deg); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 20px rgba(6, 182, 212, 0.5); }
          50% { text-shadow: 0 0 30px rgba(6, 182, 212, 0.8), 0 0 40px rgba(59, 130, 246, 0.3); }
        }
        
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite alternate;
        }
        
        /* Enhanced stars background */
        .stars {
          background-image: 
            radial-gradient(2px 2px at 20px 30px, rgba(6, 182, 212, 0.8), transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(59, 130, 246, 0.6), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(147, 51, 234, 0.5), transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(236, 72, 153, 0.4), transparent),
            radial-gradient(2px 2px at 160px 30px, rgba(6, 182, 212, 0.7), transparent);
          background-repeat: repeat;
          background-size: 200px 100px;
          animation: float 20s linear infinite;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar { 
          width: 10px; 
        }
        
        ::-webkit-scrollbar-track { 
          background: rgba(0, 0, 0, 0.3); 
        }
        
        ::-webkit-scrollbar-thumb { 
          background: linear-gradient(45deg, rgba(6, 182, 212, 0.8), rgba(59, 130, 246, 0.8));
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover { 
          background: linear-gradient(45deg, rgba(6, 182, 212, 1), rgba(59, 130, 246, 1));
        }
        
        /* Enhanced hover effects */
        .group:hover .group-hover\\:scale-110 {
          transform: scale(1.1);
        }
        
        .group:hover .group-hover\\:translate-x-1 {
          transform: translateX(0.25rem);
        }
        
        .group:hover .group-hover\\:translate-x-2 {
          transform: translateX(0.5rem);
        }
        
        .group:hover .group-hover\\:rotate-90 {
          transform: rotate(90deg);
        }
        
        /* Silver Asteroid Theme Styling */
        .silver-glow {
          text-shadow: 
            0 0 10px rgba(203, 213, 225, 0.5),
            0 0 20px rgba(148, 163, 184, 0.3),
            0 0 30px rgba(100, 116, 139, 0.2);
        }
        
        .silver-text {
          text-shadow: 0 0 8px rgba(203, 213, 225, 0.3);
        }
        
        .silver-highlight {
          text-shadow: 
            0 0 5px rgba(226, 232, 240, 0.6),
            0 0 10px rgba(203, 213, 225, 0.4);
        }
        
        /* Enhanced Responsive Typography */
        @media (max-width: 640px) {
          .text-4xl { font-size: 2rem; line-height: 1.1; }
          .text-5xl { font-size: 2.25rem; line-height: 1.1; }
          .text-6xl { font-size: 2.5rem; line-height: 1.1; }
          .text-7xl { font-size: 3rem; line-height: 1.1; }
          .text-8xl { font-size: 3.5rem; line-height: 1.1; }
          
          .text-base { font-size: 0.875rem; line-height: 1.5; }
          .text-lg { font-size: 1rem; line-height: 1.5; }
          .text-xl { font-size: 1.125rem; line-height: 1.5; }
          .text-2xl { font-size: 1.25rem; line-height: 1.4; }
          .text-3xl { font-size: 1.5rem; line-height: 1.3; }
        }
        
        @media (min-width: 641px) and (max-width: 768px) {
          .text-4xl { font-size: 2.25rem; line-height: 1.1; }
          .text-5xl { font-size: 2.5rem; line-height: 1.1; }
          .text-6xl { font-size: 3rem; line-height: 1.1; }
          .text-7xl { font-size: 3.5rem; line-height: 1.1; }
          .text-8xl { font-size: 4rem; line-height: 1.1; }
          
          .text-base { font-size: 0.9rem; line-height: 1.5; }
          .text-lg { font-size: 1.05rem; line-height: 1.5; }
          .text-xl { font-size: 1.2rem; line-height: 1.5; }
          .text-2xl { font-size: 1.4rem; line-height: 1.4; }
          .text-3xl { font-size: 1.7rem; line-height: 1.3; }
        }
        
        @media (min-width: 769px) and (max-width: 1024px) {
          .text-4xl { font-size: 2.5rem; line-height: 1.1; }
          .text-5xl { font-size: 3rem; line-height: 1.1; }
          .text-6xl { font-size: 3.5rem; line-height: 1.1; }
          .text-7xl { font-size: 4rem; line-height: 1.1; }
          .text-8xl { font-size: 4.5rem; line-height: 1.1; }
          
          .text-base { font-size: 0.95rem; line-height: 1.6; }
          .text-lg { font-size: 1.1rem; line-height: 1.6; }
          .text-xl { font-size: 1.3rem; line-height: 1.5; }
          .text-2xl { font-size: 1.6rem; line-height: 1.4; }
          .text-3xl { font-size: 1.9rem; line-height: 1.3; }
        }
        
        @media (min-width: 1025px) {
          .text-4xl { font-size: 2.75rem; line-height: 1.1; }
          .text-5xl { font-size: 3.25rem; line-height: 1.1; }
          .text-6xl { font-size: 3.75rem; line-height: 1.1; }
          .text-7xl { font-size: 4.5rem; line-height: 1.1; }
          .text-8xl { font-size: 5.5rem; line-height: 1.1; }
          
          .text-base { font-size: 1rem; line-height: 1.6; }
          .text-lg { font-size: 1.15rem; line-height: 1.6; }
          .text-xl { font-size: 1.35rem; line-height: 1.5; }
          .text-2xl { font-size: 1.7rem; line-height: 1.4; }
          .text-3xl { font-size: 2.1rem; line-height: 1.3; }
        }
        
        /* Asteroid-themed enhancements */
        .asteroid-particle {
          background: linear-gradient(45deg, 
            rgba(203, 213, 225, 0.8), 
            rgba(148, 163, 184, 0.6), 
            rgba(100, 116, 139, 0.4)
          );
          border-radius: 50%;
          animation: asteroid-drift 20s linear infinite;
        }
        
        @keyframes asteroid-drift {
          0% { 
            transform: translateY(100vh) translateX(-10px) rotate(0deg);
            opacity: 0;
          }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { 
            transform: translateY(-100px) translateX(10px) rotate(360deg);
            opacity: 0;
          }
        }
        
        /* Enhanced button hover effects */
        .btn-asteroid {
          position: relative;
          overflow: hidden;
        }
        
        .btn-asteroid::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(203, 213, 225, 0.2), 
            transparent
          );
          transition: left 0.5s;
        }
        
        .btn-asteroid:hover::before {
          left: 100%;
        }
        
        /* Content quality improvements */
        .content-enhanced {
          letter-spacing: 0.025em;
          word-spacing: 0.05em;
        }
        
        .heading-enhanced {
          letter-spacing: 0.05em;
          word-spacing: 0.1em;
        }
      `}</style>
    </>
  );
}