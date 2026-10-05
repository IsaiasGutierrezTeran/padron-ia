export function Logo({ className = 'h-11 w-11' }: { className?: string }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl bg-brand-gold font-display text-xl font-black not-italic text-brand-green shadow-soft ${className}`}
      aria-hidden="true"
    >
      IA
    </div>
  )
}
