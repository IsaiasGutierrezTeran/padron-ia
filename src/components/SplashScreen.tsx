import { useEffect, useState } from 'react'
import mascotLogo from '../assets/logo-ia.png'

const HOLD_MS = 1400
const FADE_MS = 500

export function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    // Preload the logo asset itself before starting the countdown, so the
    // splash never shows an empty frame while the image is still fetching.
    const img = new Image()
    let holdTimer: ReturnType<typeof setTimeout>
    let fadeTimer: ReturnType<typeof setTimeout>

    function startCountdown() {
      holdTimer = setTimeout(() => {
        setLeaving(true)
        fadeTimer = setTimeout(onFinish, FADE_MS)
      }, HOLD_MS)
    }

    img.onload = startCountdown
    img.onerror = startCountdown
    img.src = mascotLogo

    return () => {
      clearTimeout(holdTimer)
      clearTimeout(fadeTimer)
    }
  }, [onFinish])

  return (
    <div
      role="status"
      aria-label="Cargando"
      className={`no-print bg-brand-field fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 transition-opacity duration-500 ease-out ${
        leaving ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <img
        src={mascotLogo}
        alt="Integración Académica · FUL 2026 - 2028"
        className="w-48 animate-[splash-pop_0.7s_cubic-bezier(0.16,1,0.3,1)_both] drop-shadow-xl sm:w-56"
      />
      <div className="h-1 w-32 overflow-hidden rounded-full bg-white/20">
        <div className="h-full w-full origin-left animate-[splash-bar_1.1s_ease-in-out_0.2s_both] rounded-full bg-brand-gold" />
      </div>
    </div>
  )
}
