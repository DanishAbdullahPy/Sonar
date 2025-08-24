'use client';
import { useState, useEffect } from 'react';
import { useFirebaseUser } from "@/lib/useFirebaseUser";
import { useRouter } from "next/navigation";

// Deep Space Learning component
const DeepSpaceLearning = () => {
  const [activeModule, setActiveModule] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Mock data for deep space modules
  const modules = {
    overview: {
      title: "Deep Space Overview",
      description: "Explore the vast expanse beyond our solar system",
      content: [
        {
          title: "What is Deep Space?",
          text: "Deep space refers to the region of space that is far away from Earth and our solar system. It encompasses interstellar space, the space between stars, and intergalactic space, the space between galaxies. This vast expanse makes up the majority of our universe.",
          image: "/space.jpg"
        },
        {
          title: "The Scale of Deep Space",
          text: "The distances in deep space are almost incomprehensible. For example, the nearest star to our solar system, Proxima Centauri, is about 4.24 light-years away. A light-year is the distance light travels in one year, approximately 9.46 trillion kilometers.",
          image: "/globe.svg"
        },
        {
          title: "Exploration Challenges",
          text: "Exploring deep space presents enormous challenges. The vast distances require enormous amounts of energy and time to traverse. Communication delays make real-time control impossible, and the harsh radiation environment poses risks to both equipment and potential human explorers.",
          image: "/rocket.jpg"
        }
      ]
    },
    blackholes: {
      title: "Black Holes",
      description: "Understanding these cosmic phenomena",
      content: [
        {
          title: "Formation of Black Holes",
          text: "Black holes form when massive stars collapse under their own gravity at the end of their life cycles. When a star at least 20 times more massive than our Sun runs out of fuel, it can no longer support itself against gravitational collapse, forming a black hole.",
          image: "/next.svg"
        },
        {
          title: "Event Horizon",
          text: "The event horizon is the point of no return around a black hole. Once anything crosses this boundary, it cannot escape, not even light. This is why black holes are completely invisible to telescopes.",
          image: "/window.svg"
        },
        {
          title: "Supermassive Black Holes",
          text: "At the center of most large galaxies, including our Milky Way, lie supermassive black holes. These cosmic giants can have masses equivalent to millions or even billions of times our Sun's mass.",
          image: "/alan.gif"
        }
      ]
    },
    galaxies: {
      title: "Galaxies",
      description: "Islands of stars in the cosmic ocean",
      content: [
        {
          title: "What are Galaxies?",
          text: "Galaxies are massive systems of stars, stellar remnants, interstellar gas, dust, and dark matter bound together by gravity. The smallest galaxies contain only a few million stars, while the largest can contain up to a hundred trillion stars.",
          image: "/astro.jpg"
        },
        {
          title: "Types of Galaxies",
          text: "Astronomers classify galaxies into three main types: spiral galaxies like our Milky Way, elliptical galaxies which are more rounded and contain older stars, and irregular galaxies which don't fit into the other categories.",
          image: "/file.svg"
        },
        {
          title: "Galaxy Clusters",
          text: "Galaxies are not scattered randomly throughout the universe. Instead, they tend to cluster together in groups called galaxy clusters, which are the largest gravitationally bound structures in the universe.",
          image: "/globe.svg"
        }
      ]
    },
    nebulas: {
      title: "Nebulas",
      description: "Stellar nurseries and cosmic clouds",
      content: [
        {
          title: "What are Nebulas?",
          text: "Nebulas are giant clouds of dust and gas in space. Some nebulae are formed from the gas and dust thrown out by the explosion of a dying star, known as a supernova. Others are regions where new stars are beginning to form.",
          image: "/rocket.jpg"
        },
        {
          title: "Emission Nebulas",
          text: "Emission nebulae are clouds of ionized gas that emit light of various colors. They often appear red due to the dominant emission line of hydrogen. These nebulae are sites of active star formation.",
          image: "/next.svg"
        },
        {
          title: "Dark Nebulas",
          text: "Dark nebulae are dense clouds of cosmic dust that block light from objects behind them. These regions appear as dark silhouettes against brighter backgrounds and are often sites of future star formation.",
          image: "/window.svg"
        }
      ]
    },
    darkmatter: {
      title: "Dark Matter",
      description: "The invisible glue of the universe",
      content: [
        {
          title: "What is Dark Matter?",
          text: "Dark matter is a form of matter that doesn't emit, absorb, or reflect light, making it invisible to telescopes. Despite its elusive nature, dark matter makes up about 27% of the universe, while ordinary matter that we can see makes up only about 5%.",
          image: "/alan.gif"
        },
        {
          title: "Evidence for Dark Matter",
          text: "The existence of dark matter is inferred from its gravitational effects on visible matter. For example, stars at the edges of galaxies move faster than they should based on the visible matter alone, suggesting the presence of additional mass we can't see.",
          image: "/astro.jpg"
        },
        {
          title: "Dark Matter Candidates",
          text: "Scientists propose various candidates for dark matter particles, including WIMPs (Weakly Interacting Massive Particles) and axions. However, these particles have not yet been directly detected, making dark matter one of the biggest mysteries in physics.",
          image: "/file.svg"
        }
      ]
    }
  };

  useEffect(() => {
    // Simulate loading content
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-[#0f172a] rounded-xl p-6 shadow-lg border border-[#1e293b]">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <span className="text-4xl">🌌</span> Deep Space Learning
        </h2>
        <p className="text-gray-300 mb-6">Explore the mysteries of the cosmos through our interactive modules</p>

        {/* Module Navigation */}
        <div className="flex flex-wrap gap-3 mb-8">
          {Object.keys(modules).map(moduleKey => (
            <button
              key={moduleKey}
              onClick={() => setActiveModule(moduleKey)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeModule === moduleKey
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#1e293b] text-gray-300 hover:bg-[#334155]'
              }`}
            >
              {modules[moduleKey].title}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-[#1e293b] rounded-xl p-6 border border-[#334155]">
              <h3 className="text-xl font-bold text-white mb-2">{modules[activeModule].title}</h3>
              <p className="text-gray-300 mb-6">{modules[activeModule].description}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {modules[activeModule].content.map((item, index) => (
                <div key={index} className="bg-[#1e293b] rounded-xl overflow-hidden shadow-lg border border-[#334155] transition-transform hover:scale-[1.02]">
                  <div className="aspect-video bg-gradient-to-r from-blue-900/20 to-purple-900/20 flex items-center justify-center">
                    <div className="text-6xl opacity-50">
                      {index % 3 === 0 ? "🌠" : index % 3 === 1 ? "🌌" : "🪐"}
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-semibold text-white mb-3">{item.title}</h4>
                    <p className="text-gray-300 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Learning Section */}
      <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] rounded-xl p-6 shadow-lg border border-[#1e293b]">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-3xl">🚀</span> Interactive Learning
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1e293b] rounded-xl p-6 border border-[#334155] text-center">
            <div className="text-4xl mb-4">🌠</div>
            <h4 className="text-lg font-semibold text-white mb-2">Simulate Gravity</h4>
            <p className="text-gray-300 text-sm">Explore how gravity affects objects in space with our interactive simulator</p>
          </div>

          <div className="bg-[#1e293b] rounded-xl p-6 border border-[#334155] text-center">
            <div className="text-4xl mb-4">🌌</div>
            <h4 className="text-lg font-semibold text-white mb-2">Scale of the Universe</h4>
            <p className="text-gray-300 text-sm">Journey through cosmic scales from Earth to the observable universe</p>
          </div>

          <div className="bg-[#1e293b] rounded-xl p-6 border border-[#334155] text-center">
            <div className="text-4xl mb-4">🪐</div>
            <h4 className="text-lg font-semibold text-white mb-2">Build Your Solar System</h4>
            <p className="text-gray-300 text-sm">Create and customize your own planetary system</p>
          </div>
        </div>
      </div>

      {/* Did You Know Section */}
      <div className="bg-[#0f172a] rounded-xl p-6 shadow-lg border border-[#1e293b]">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-3xl">✨</span> Cosmic Facts
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#1e293b] rounded-lg p-4 border border-[#334155]">
            <div className="text-3xl mb-2">🌑</div>
            <h4 className="font-semibold text-white">Black Hole Weight</h4>
            <p className="text-gray-300 text-sm">The smallest known black hole is only 3.3 times the mass of our Sun</p>
          </div>

          <div className="bg-[#1e293b] rounded-lg p-4 border border-[#334155]">
            <div className="text-3xl mb-2">🌠</div>
            <h4 className="font-semibold text-white">Neutron Star Speed</h4>
            <p className="text-gray-300 text-sm">Neutron stars can spin up to 700 times per second</p>
          </div>

          <div className="bg-[#1e293b] rounded-lg p-4 border border-[#334155]">
            <div className="text-3xl mb-2">🌌</div>
            <h4 className="font-semibold text-white">Galactic Collisions</h4>
            <p className="text-gray-300 text-sm">Our Milky Way is on a collision course with the Andromeda galaxy</p>
          </div>

          <div className="bg-[#1e293b] rounded-lg p-4 border border-[#334155]">
            <div className="text-3xl mb-2">🪐</div>
            <h4 className="font-semibold text-white">Diamond Rain</h4>
            <p className="text-gray-300 text-sm">Scientists believe it rains diamonds on Neptune and Uranus</p>
          </div>
        </div>
      </div>

      {/* Resources Section */}
      <div className="bg-gradient-to-r from-[#1e293b] to-[#0f172a] rounded-xl p-6 shadow-lg border border-[#1e293b]">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-3xl">📚</span> Learning Resources
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0f172a] rounded-xl p-6 border border-[#1e293b]">
            <h4 className="text-lg font-semibold text-white mb-3">Recommended Reading</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="mr-2">📖</span>
                <span>"Cosmos" by Carl Sagan</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📖</span>
                <span>"A Brief History of Time" by Stephen Hawking</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📖</span>
                <span>"The Elegant Universe" by Brian Greene</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📖</span>
                <span>"Astrophysics for People in a Hurry" by Neil deGrasse Tyson</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#0f172a] rounded-xl p-6 border border-[#1e293b]">
            <h4 className="text-lg font-semibold text-white mb-3">Video Resources</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="mr-2">🎬</span>
                <span>"Cosmos: A Spacetime Odyssey" - Hosted by Neil deGrasse Tyson</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🎬</span>
                <span>"Our Universe" - Documentary series exploring deep space</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🎬</span>
                <span>"The Fabric of the Cosmos" - Based on Brian Greene's book</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🎬</span>
                <span>"Space's Deepest Secrets" - Exploring the mysteries of the cosmos</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};


export default function LearnPage() {
  const { user, loading } = useFirebaseUser();
  const router = useRouter();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) {
    router.replace("/login");
    return null;
  }

  return (
    <main className="px-4 pt-28 max-w-7xl mx-auto min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
      <DeepSpaceLearning />
    </main>
  );
}