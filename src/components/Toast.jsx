import { useApp } from '../context/AppContext'

export default function Toast() {
  const { toast } = useApp()

  return (
    <div
      className={`fixed bottom-8 left-1/2 z-[300] transition-all duration-300 ${
        toast.visible ? "opacity-100 animate-toast-in" : "opacity-0 pointer-events-none"
      }`}
      style={{ transform: "translateX(-50%)" }}
    >
      <div className={`flex items-center gap-3 px-5 py-3.5 text-[0.72rem] font-medium tracking-[0.12em] whitespace-nowrap shadow-2xl ${
        toast.type === 'error' ? 'bg-red-900/90 text-red-200 border border-red-700/40' : 'bg-surface border border-white/10 text-cream'
      }`}>
        {toast.type === 'error' ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8f542" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        {toast.message}
      </div>
    </div>
  )
}
