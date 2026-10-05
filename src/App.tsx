import { Printer, RotateCcw, ShieldCheck, UserRoundCheck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { consultarPadron, PadronApiError } from './api'
import mascotLogo from './assets/logo-ia.png'
import { InfoPanel } from './components/InfoPanel'
import { Logo } from './components/Logo'
import { ResultCard } from './components/ResultCard'
import { ResultSkeleton } from './components/ResultSkeleton'
import { SearchForm } from './components/SearchForm'
import { SplashScreen } from './components/SplashScreen'
import { StatusMessage } from './components/StatusMessage'
import type { PadronRecord } from './types'

type ViewState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; records: PadronRecord[] }
  | { status: 'error'; message: string; code?: string }

function App() {
  const [state, setState] = useState<ViewState>({ status: 'idle' })
  const [showSplash, setShowSplash] = useState(true)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => () => abortRef.current?.abort(), [])

  async function handleSearch(registro: string) {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setState({ status: 'loading' })
    try {
      const res = await consultarPadron(registro, controller.signal)
      setState({ status: 'success', records: [res.data, ...res.adicionales] })
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      if (err instanceof PadronApiError) {
        setState({ status: 'error', message: err.message, code: err.code })
      } else {
        setState({ status: 'error', message: 'Ocurrió un error inesperado. Intenta nuevamente.' })
      }
    }
  }

  function handleReset() {
    abortRef.current?.abort()
    setState({ status: 'idle' })
  }

  const showingResult = state.status === 'success'

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <div className="min-h-dvh bg-[#f3f8f3]">
      <header className="no-print relative bg-brand-field">
        <div className="relative z-10 mx-auto flex max-w-5xl items-center gap-3.5 px-5 py-6 sm:px-8">
          <Logo />
          <div>
            <p className="font-script text-2xl leading-none text-brand-gold-light">Sos vos</p>
            <h1 className="font-display text-2xl font-extrabold italic leading-tight text-white sm:text-[28px]">
              Consulta al Padrón Electoral
            </h1>
          </div>
        </div>
        <img
          src={mascotLogo}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-3 bottom-[-14px] z-10 hidden h-28 w-auto drop-shadow-xl md:right-10 sm:block sm:h-32 lg:h-36"
        />
      </header>

      <main className="mx-auto max-w-5xl px-5 py-7 sm:px-8 sm:py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr] lg:items-start lg:gap-7">
          <div className="no-print lg:sticky lg:top-7">
            <InfoPanel />
          </div>

          <div className="flex flex-col gap-5">
            {state.status === 'idle' && (
              <div className="animate-card-in rounded-2xl border border-slate-200/70 bg-white p-5 shadow-card sm:p-7">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
                    <ShieldCheck className="size-6" strokeWidth={2.2} />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-extrabold italic text-slate-800">Verifica tu habilitación</h2>
                    <p className="text-sm text-slate-500">Ingresa tu número de registro para ver tu lugar de votación.</p>
                  </div>
                </div>
                <SearchForm onSubmit={handleSearch} loading={false} />
              </div>
            )}

            {state.status === 'loading' && (
              <>
                <div className="animate-card-in rounded-2xl border border-slate-200/70 bg-white p-5 shadow-card sm:p-7">
                  <SearchForm onSubmit={handleSearch} loading />
                </div>
                <ResultSkeleton />
              </>
            )}

            {state.status === 'error' && (
              <>
                <StatusMessage message={state.message} code={state.code} />
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  <RotateCcw className="size-4" />
                  Intentar con otro registro
                </button>
              </>
            )}

            {showingResult && (
              <>
                <div className="animate-card-in flex items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4 shadow-soft">
                  <div className="flex items-center gap-2.5 text-brand-green">
                    <UserRoundCheck className="size-6" strokeWidth={2.2} />
                    <div>
                      <h2 className="font-display text-lg font-extrabold italic leading-none text-slate-800">
                        {state.records[0].nombre}
                      </h2>
                      <p className="text-xs font-semibold text-slate-400">
                        {state.records.length > 1
                          ? `Registrado en ${state.records.length} carreras`
                          : 'Estudiante habilitado'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="no-print hidden shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 sm:flex"
                  >
                    <Printer className="size-4" />
                    Imprimir
                  </button>
                </div>

                {state.records.length > 1 && (
                  <p className="no-print -mt-2 rounded-xl border border-brand-green/15 bg-brand-green/5 px-4 py-2.5 text-sm font-medium text-brand-green-dark">
                    Tu registro figura en {state.records.length} carreras. Se muestran todas a continuación.
                  </p>
                )}

                {state.records.map((record, i) => (
                  <ResultCard key={`${record.fac}-${record.registro}`} record={record} index={i} />
                ))}

                <div className="no-print flex flex-col gap-2.5 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-green px-5 py-3.5 text-base font-bold text-white shadow-soft transition hover:bg-brand-green-dark active:scale-[0.99]"
                  >
                    <RotateCcw className="size-5" />
                    Nueva consulta
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-base font-bold text-slate-600 transition hover:bg-slate-50 sm:hidden"
                  >
                    <Printer className="size-5" />
                    Imprimir
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="no-print px-5 pb-8 text-center text-xs font-medium text-slate-400">
        IA · FUL 2026 - 2028 · Sos vos
      </footer>
      </div>
    </>
  )
}

export default App
