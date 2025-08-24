 
'use client'

export default function DashboardWelcome({ user }) {
  return (
    <section className="w-full py-12 flex flex-col items-center text-center gap-4">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-400 to-yellow-200 bg-clip-text text-transparent mb-2">
        Welcome aboard, {user?.firstName || 'Explorer'}!
      </h1>
      <p className="text-lg text-gray-200 max-w-xl">
        This is your <b>Mission Control dashboard</b>. View today’s asteroids, track Mars rovers, explore your personal Star Log, or review the latest cosmic discoveries.
      </p>
    </section>
  )
}
